/* eslint-disable no-new */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import './style.scss';

export default class MapView extends Component {
  static propTypes = {
    height: PropTypes.number,
    zoom: PropTypes.number,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    height: 350,
    zoom: 12,
    disabled: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    let script = document.getElementById('mapScript');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?' +
        'v=1.4.7&key=38dbfac589d262c87bd3aaba70038538&plugin=AMap.Geocoder&callback=initMap';
      script.id = 'mapScript';
      document.head.appendChild(script);
      const UIScript = document.createElement('script');
      UIScript.src = 'https://webapi.amap.com/ui/1.0/main-async.js';
      document.head.appendChild(UIScript);
      if (!window.initMap) {
        window.initMap = () => {
          this.setState({
            ...this.state,
            loaded: true,
          });
        };
      }
    } else {
      this.state.loaded = true;
    }
  }

  componentDidMount() {
    const {
      loaded,
    } = this.state;
    if (loaded) {
      this.initMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.disabled !== nextProps.disabled) {
      nextProps.disabled ? this.positionPicker && this.positionPicker.stop() :
        this.positionPicker && this.positionPicker.start();
    }
    if (Object.prototype.toString.call(nextProps.value) === '[object Array]' || typeof nextProps.value === 'string') {
      this.update(nextProps.value); // dead loop
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      loaded,
    } = this.state;
    if (!loaded && nextState.loaded) {
      this.initMap();
    }
  }

  initMap() {
    const {
      id,
      value,
      zoom,
      disabled,
    } = this.props;
    this.reloadUITimer = setInterval(() => {
      if (window.initAMapUI) {
        clearInterval(this.reloadUITimer);
        window.initAMapUI && window.initAMapUI();
        window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
          this.positionPicker = new PositionPicker({
            mode:'dragMap',
            map: this.map,
            iconStyle: {
              url: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
              size:[15, 25],
              ancher:[7, 29],
            },
          });
          this.positionPicker.on('success', (positionResult) => {
            this.update({ ...positionResult.regeocode, location: positionResult.position });
          });
          this.positionPicker.on('fail', () => {
          });
          !disabled && this.positionPicker.start();
        });
      }
    }, 100);
    if (window.AMap) {
      this.map = new window.AMap.Map(id, {
        resizeEnable: true,
        zoom,
        viewMode: '3D',
        expandZoomRange: true,
        pitch: 0,
        scrollWheel:false,
      });
      this.map.on('movestart', () => {
        if (!this.props.disabled) {
          this.map.remove(this.markers);
          this.infoWindow && this.infoWindow.close();
        }
      });
      this.markers = [];
      this.geocoder = new window.AMap.Geocoder({
        radius: 500,
      });
      window.AMap.plugin(['AMap.Scale', 'AMap.ControlBar', 'AMap.Autocomplete'], () => {
        const toolBar = new window.AMap.Scale();
        this.map.addControl(toolBar);
        const controlBar = new window.AMap.ControlBar();
        this.map.addControl(controlBar);
        const autoOptions = {
          city: '全国',
          input: 'tipinput',
        };
        this.autoComplete = new window.AMap.Autocomplete(autoOptions);
        window.AMap.event.addListener(this.autoComplete, 'select', (data) => {
          this.poi = data.poi;
        });
      });
      this.update(value);
    }
  }

  update(value) {
    if (this.map) {
      this.infoWindow && this.infoWindow.close();
      this.map.remove(this.markers);
      if (Object.prototype.toString.call(value) === '[object Array]') {
        this.geocoder.getAddress(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.map.setCenter(value);
            this.addMarker(value, result.regeocode.formattedAddress);
            this.props.onChange({ ...result.regeocode, location: { lng: value[0], lat: value[1] } });
          }
        });
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        // this.map.setCenter([value.location.lat, value.location.lng]);
        this.addMarker([value.location.lng, value.location.lat], value.formattedAddress);
        this.props.onChange(value);
      } else {
        this.geocoder.getLocation(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.geocoderCallBack(result);
          }
        });
      }
    }
  }

  addMarker(value, address) {
    const marker = new window.AMap.Marker({
      map: this.map,
      position: value,
    });
    if (address) {
      this.infoWindow = new window.AMap.InfoWindow({
        content: address,
        offset: { x: 0, y: -30 },
      });
      marker.on('mouseover', () => {
        this.infoWindow.open(this.map, marker.getPosition());
      });
    }
    this.markers.push(marker);
  }

  geocoderCallBack(data) {
    const geocode = data.geocodes;
    for (let i = 0; i < geocode.length; i += 1) {
      this.addMarker([geocode[i].location.getLng(), geocode[i].location.getLat()], geocode[i].formattedAddress);
    }
    this.map.setFitView();
    this.map.setZoom(this.props.zoom);
    if (geocode.length === 1) {
      const latlng = [geocode[0].location.getLng(), geocode[0].location.getLat()];
      this.map.setCenter(latlng);
      this.startValue = latlng;
      this.props.onChange({ coordinate: latlng, address: geocode[0].formattedAddress });
    } else {
      this.props.onChange(undefined);
    }
  }

  render() {
    const {
      id,
      height,
    } = this.props;

    return (
      <div
        id={id}
        style={{
          height,
        }}
      >
        <div id="myPageTop">
          <input
            id="tipinput"
            placeholder="输入详细地址，越详细定位越精准"
          />
          <Button
            type="primary"
            onClick={() => {
              if (this.poi && this.poi.location) {
                this.update([this.poi.location.lng, this.poi.location.lat]);
              } else if (this.poi) {
                this.update(this.poi.district + this.poi.name);
              } else {
                const v = document.getElementById('tipinput').value;
                if (v) {
                  this.update(v);
                }
              }
            }}
          >
            <Icon type="search" />
          </Button>
        </div>
      </div>
    );
  }
}
