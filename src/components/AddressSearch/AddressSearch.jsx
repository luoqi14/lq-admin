import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';
import './style.scss';

export default class AddressSearch1 extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      value: props.value || '',
    };

    let script = document.getElementById('mapScript');
    if (!script) {
      script = document.createElement('script');
      script.src =
        'https://webapi.amap.com/maps?' +
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
    const { loaded } = this.state;
    if (loaded) {
      this.initMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldValue = (this.props.value && this.props.value) || {};
    const newValue = (nextProps.value && nextProps.value) || {};

    if (
      !oldValue.address &&
      !oldValue.location &&
      newValue.address &&
      newValue.location
    ) {
      this.setState({ value: newValue.address });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { loaded } = this.state;
    if (!loaded && nextState.loaded) {
      this.initMap();
    }
  }

  onSearch = () => {
    if (this.poi && this.poi.location) {
      this.onPropsChange({
        location: [this.poi.location.lng, this.poi.location.lat],
        address: `${this.poi.district}${this.poi.name}`,
      });
    } else if (this.poi) {
      this.update(this.poi.district + this.poi.name);
    } else {
      const v = document.getElementById('tipinput').value;
      if (v) {
        this.update(v);
      }
    }
  };

  onPropsChange = obj => {
    this.setState(
      {
        value: (obj && obj.address) || '',
      },
      () => {
        if (obj && obj.location) {
          const newObj = {
            address: obj.address,
            location: this.convert(obj.location),
          };
          this.props.onChange(newObj);
        }
      }
    );
  };

  onChange = e => {
    const value = e && e.target.value;
    this.setState({ value }, () => {
      if (!value) {
        this.onPropsChange(undefined);
      }
    });
  };

  onBlur = e => {
    const value = e && e.target.value;
    this.setState({ value }, () => {
      this.props.onChange({
        address: value,
        location: value ? (this.props.value || {}).location : null,
      });
    });
  };

  convert = location => {
    if (!location || !location.length) {
      return location;
    }
    const x = location[0];
    const y = location[1];
    const xPi = (Math.PI * 3000.0) / 180.0;
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi);
    let rLng = z * Math.cos(theta) + 0.0065;
    let rLat = z * Math.sin(theta) + 0.006;
    rLng = Number(rLng).toFixed(6);
    rLat = Number(rLat).toFixed(6);
    return [rLng, rLat];
  };

  initMap() {
    const { value } = this.props;
    if (window.AMap) {
      this.geocoder = new window.AMap.Geocoder({
        radius: 500,
      });
      window.AMap.plugin(['AMap.Autocomplete'], () => {
        const autoOptions = {
          city: '全国',
          input: 'tipinput',
        };
        this.autoComplete = new window.AMap.Autocomplete(autoOptions);
        window.AMap.event.addListener(this.autoComplete, 'select', data => {
          this.poi = data.poi;
          this.onSearch();
        });
      });
      this.update(value);
    }
  }

  update(value) {
    if (this.state.loaded) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        this.geocoder.getAddress(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.onPropsChange({
              location: [value[0], value[1]],
              address: result.regeocode.formattedAddress,
            });
          }
        });
      } else {
        this.geocoder.getLocation(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.geocoderCallBack(result);
          }
        });
      }
    }
  }

  geocoderCallBack(data) {
    const geocode = data.geocodes;
    if (geocode.length === 1) {
      const latlng = [
        geocode[0].location.getLng(),
        geocode[0].location.getLat(),
      ];
      this.onPropsChange({
        location: latlng,
        address: geocode[0].formattedAddress,
      });
    } else {
      this.onPropsChange(undefined);
    }
  }

  render() {
    const { disabled } = this.props;
    const addonAfter = (
      <Icon type="search" onClick={this.onSearch} title="根据输入地址定位" />
    );
    return (
      <div id="address-select">
        <Input
          id="tipinput"
          placeholder="输入详细地址，越详细定位越精准"
          addonAfter={addonAfter}
          disabled={disabled}
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}
