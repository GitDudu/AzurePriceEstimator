/* eslint-disable no-multi-str */
import React, { Component } from 'react';
import './common.css';
import './appFunctions.js';
import Slider from './Slider.js'

class VM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loc: 'uks',
      ranges: [20, 109, 30, 22],
      vmprices: [40.30, 74.46, 149.65, 299.30],
      vmBillOpt: 'payAsYouGo',
      payAsYouGo: {
        uks: [40.30, 74.46, 149.65, 299.30],
        ukw: [51.10, 89.06, 177.39, 354.78],
        ne: [39.13, 72.42, 144.54, 289.81],
        we: [40.88, 75.92, 151.84, 303.68]
      },
      oneYearResv: {
        uks: [30.92, 56.09, 112.18, 224.36],
        ukw: [30.92, 56.09, 112.18, 224.36],
        ne: [30.01, 54.17, 108.35, 216.61],
        we: [31.84, 57.93, 115.84, 231.61]
      },
      threeYearResv: {
        uks: [22.87, 39.89, 79.79, 159.59],
        ukw: [22.87, 39.89, 79.79, 159.59],
        ne: [21.92, 38.03, 76.07, 152.11],
        we: [23.56, 41.26, 82.51, 165.02]
      },
      vmTransac: 100000,
      vmOSDisk: 5.07,
      weekendCheck: false,
      sqlPayAsYouGo: { uks: 1694.99, ukw: 1694.99, ne: 1490.53, we: 1561.65 },
      sqlOneYearResv: { uks: 1305.80, ukw: 1305.80, ne: 1173.12, we: 1219.14 },
      sqlThreeYearResv: { uks: 1083.82, ukw: 1083.82, ne: 991.78, we: 1023.79 },
      sqlNum: 15,
      sqlBilling: 'sqlPayAsYouGo',
      sqlStorage: 10,
      dataTransfer: 2,
      dataScheme: '1',
      fileStorage: 1,
      fileStorageType: '1',
      supportType: '1',
      firewallUnit: 1,
      recoveryType: '1',
      recoveryNum: 0,
      backupVMNum: 150
    };
  }

  handleSlide = (i, val) => {
    const ranges = this.state.ranges.slice();
    ranges[i] = val;
    this.setState({ ranges: ranges });
  }

  handleChangeBilling = (b) => {
    this.setState({ vmBillOpt: b }, () => this.updateVmPrice());
  }

  updateVmPrice() {
    var prices = this.state[this.state.vmBillOpt][this.state.loc].slice();
    this.setState({ vmprices: prices });
  }

  renderSlider(i, name) {
    return <Slider value={this.state.ranges[i]} name={name} id={i} onSlide={this.handleSlide} />;
  }

  renderInfoIcon(msg) {
    return <i className="far fa-question-circle text-info" data-toggle="popover" data-content={msg}></i>
  }

  getTotalVMPrice() {
    var sum = 0;
    for (var i = 0; i < this.state.ranges.length; i++) {
      if (this.state.weekendCheck && i < 2)
        sum += (5 / 7) * this.state.ranges[i] * this.state.vmprices[i];
      else
        sum += this.state.ranges[i] * this.state.vmprices[i];
    }
    return Math.round(sum +
      (Number(this.state.vmOSDisk) + Number(this.state.vmTransac) * 0.00036) * this.state.ranges.reduce(this.reducer));
  }

  getTotalDBPrice() {
    return Math.round(this.state.sqlNum * this.state[this.state.sqlBilling][this.state.loc] + (this.state.sqlStorage - 1) * 4.23);
  }

  getTotalDTPrice() {
    if (this.state.dataScheme === '1')
      return Math.round((this.state.dataTransfer * 2 * 22 - 5) * 0.087);
    else if (this.state.dataScheme === '2')
      return 55 + Math.round(this.state.dataTransfer * 2 * 22 * 0.025);
    else if (this.state.dataScheme === '3')
      return 110 + Math.round(this.state.dataTransfer * 2 * 22 * 0.025);
    else
      return 0;
  }

  getStoragePrice() {
    var unit = 0;
    switch (this.state.fileStorageType) {
      case '1':
        unit = 63.75;
        break;
      case '2':
        unit = 150.05;
        break;
      default:
        break;
    }
    return Math.round(this.state.fileStorage * unit);
  }

  getBackupPrice() {
    return Math.round(this.state.backupVMNum * 5.73);
  }

  getSupportPrice() {
    var unit = 0;
    switch (this.state.supportType) {
      case '1':
        unit = 0;
        break;
      case '2':
        unit = 29;
        break;
      case '3':
        unit = 100;
        break;
      case '4':
        unit = 1000;
        break;
      default:
        break;
    }
    return unit;
  }

  getFirewallPrice() {
    return Math.round(this.state.firewallUnit * 916.10);
  }

  getRecoveryPrice() {
    var unit = 0;
    switch (this.state.recoveryType) {
      case '1':
        unit = 16;
        break;
      case '2':
        unit = 25;
        break;
      default:
        break;
    }
    return Math.round(this.state.recoveryNum * unit);
  }

  getTotalPrice() {
    return this.getTotalVMPrice() + this.getTotalDBPrice() + this.getTotalDTPrice() +
      this.getSupportPrice() + this.getStoragePrice() + this.getFirewallPrice() +
      this.getRecoveryPrice() + this.getBackupPrice();
  }

  reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);

  updateLoc(e) {
    this.setState({ loc: e.target.value }, () => { this.updateVmPrice(); this.getTotalPrice() });
  }

  updateWeekendCheck(e) {
    this.setState({ weekendCheck: e.target.checked }, () => this.getTotalPrice());
  }

  updateDataSlider(e) {
    this.setState({ dataTransfer: e.target.value }, () => this.getTotalPrice());
  }

  updateSqlBilling(b) {
    this.setState({ sqlBilling: b });
  }

  updateState(e, key) {
    this.setState({ [key]: e.target.value });
  }

  render() {
    return [
      <div className="card border-primary">
        <header className="card-header text-white bg-primary">
          Data centre location
        </header>
        <div className="card-body">
          <div className="form-group">
            <div className="row">
              <div className="col-sm-4">
                <select className="form-control" value={this.state.loc} onChange={(e) => this.updateLoc(e)}>
                  <option value="uks">UK South (Slough)</option>
                  <option value="ukw">UK West (Wales)</option>
                  <option value="ne">North Europe (Ireland)</option>
                  <option value="we">West Europe (Netherlands)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>,
      <div className="card border-primary">
        <header className="card-header text-white bg-primary">
          Virtual machines
        </header>
        <div className="card-body">
          <form>
            <div className="form-group">
              <div className="row">
                <legend className="col-sm-2 col-form-label pt-0">Billing option</legend>
                <div className="col-sm-10">
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" defaultChecked onChange={() => this.handleChangeBilling('payAsYouGo')} id="vmRadio1" name="vmRadio" />
                    <label className="form-check-label" htmlFor="vmRadio1">Pay as you go</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" onChange={() => this.handleChangeBilling('oneYearResv')} id="vmRadio2" name="vmRadio" />
                    <label className="form-check-label" htmlFor="vmRadio2">1 year reserved (~25% savings)</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" onChange={() => this.handleChangeBilling('threeYearResv')} id="vmRadio3" name="vmRadio" />
                    <label className="form-check-label" htmlFor="vmRadio3">3 year reserved (~47% savings)</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <legend className="col-sm-2 col-form-label" htmlFor="vmTransac">Storage transactions</legend>
                <div className="col-sm-4">
                  <input type="input" className="form-control" name="vmTransac" id="vmTransac" value={this.state.vmTransac} onChange={(e) => this.updateState(e, 'vmTransac')}></input>
                </div>
                <legend className="col-sm-2 col-form-label" htmlFor="vmOSDisk">Managed OS Disks</legend>
                <div className="col-sm-4">
                  <select type="select" className="form-control" name="vmOSDisk" id="vmOSDisk" value={this.state.vmOSDisk} onChange={(e) => this.updateState(e, 'vmOSDisk')}>
                    <option value="5.07">3 &#215; 32GB ($5.07/month)</option>
                    <option value="6.62">2 &#215; 64GB ($6.62/month)</option>
                    <option value="6.48">1 &#215; 128GB ($6.48/month)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-6">
                <div className="form-check form-check-inline">
                  <label className="form-check-label" htmlFor="weekendCheck">
                    Turn off Basic and Medium machines on weekends?
                  </label>
                  <input className="form-check-input" type="checkbox" id="weekendCheck" style={{ 'marginLeft': "10px" }} checked={this.state.weekendCheck} onChange={(e) => this.updateWeekendCheck(e)} />
                </div>
              </div>
            </div>
            {this.renderSlider(0, 'Basic')}
            {this.renderSlider(1, 'Medium')}
            {this.renderSlider(2, 'High')}
            {this.renderSlider(3, 'Ultra')}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">VM config</th>
                  <th scope="col">Unit price</th>
                  <th scope="col">Number</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Basic {this.renderInfoIcon("B2S: 2 CPU, 4GB memory & 8GB temporary memory")}</th>
                  <td>{this.state.vmprices[0]}</td>
                  <td>{this.state.ranges[0]}</td>
                  <td className="vmprice">{Math.round(this.state.vmprices[0] * this.state.ranges[0])}</td>
                </tr>
                <tr>
                  <th scope="row">Medium {this.renderInfoIcon("B2MS: 2 CPU, 8GB memory & 16GB temporary memory")}</th>
                  <td>{this.state.vmprices[1]}</td>
                  <td>{this.state.ranges[1]}</td>
                  <td className="vmprice">{Math.round(this.state.vmprices[1] * this.state.ranges[1])}</td>
                </tr>
                <tr>
                  <th scope="row">High {this.renderInfoIcon("B4MS: 4 CPU, 16GB memory & 32GB temporary memory")}</th>
                  <td>{this.state.vmprices[2]}</td>
                  <td>{this.state.ranges[2]}</td>
                  <td className="vmprice">{Math.round(this.state.vmprices[2] * this.state.ranges[2])}</td>
                </tr>
                <tr>
                  <th scope="row">Ultra {this.renderInfoIcon("B8MS: 8 CPU, 32GB memory & 64GB temporary memory")}</th>
                  <td>{this.state.vmprices[3]}</td>
                  <td>{this.state.ranges[3]}</td>
                  <td className="vmprice">{Math.round(this.state.vmprices[3] * this.state.ranges[3])}</td>
                </tr>
              </tbody>
            </table>
            <div className="form-group">
              <div className="row">
                <label className="col-sm-6 col-form-label text-primary"><h5><strong>VM sub-total: &nbsp;US$&nbsp;
                  {this.getTotalVMPrice()} per month
                  </strong></h5>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>,
      <div className="card border-primary">
        <header className="card-header text-white bg-primary">SQL Database</header>
        <div className="card-body">
          <form>
            <div className="form-group">
              <div className="row">
                <legend className="col-sm-2 col-form-label pt-0">Billing option</legend>
                <div className="col-sm-10">
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" defaultChecked onChange={() => this.updateSqlBilling('sqlPayAsYouGo')} id="sqlRadio1" name="sqlRadio" />
                    <label className="form-check-label" htmlFor="sqlRadio1">Pay as you go</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" onChange={() => this.updateSqlBilling('sqlOneYearResv')} id="sqlRadio2" name="sqlRadio" />
                    <label className="form-check-label" htmlFor="sqlRadio2">1 year reserved (~23% savings)</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" onChange={() => this.updateSqlBilling('sqlThreeYearResv')} id="sqlRadio3" name="sqlRadio" />
                    <label className="form-check-label" htmlFor="sqlRadio3">3 year reserved (~36% savings)</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <legend className="col-sm-2 col-form-label">Instances</legend>
                <div className="col-sm-1">
                  <input type="number" className="form-control" min="1" name="sqlNum" id="sqlNum" value={this.state.sqlNum} onChange={(e) => this.updateState(e, 'sqlNum')}></input>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <legend className="col-sm-2 col-form-label">Storage {this.renderInfoIcon("Storage size must be specified between 32 GB and 8 TB, in increments of 32 GB.")}</legend>
                <div className="col-sm-1">
                  <input type="number" className="form-control" min="1" name="sqlStorage" id="sqlStorage" value={this.state.sqlStorage} onChange={(e) => this.updateState(e, 'sqlStorage')}></input>
                </div>
                <legend className="col-sm-8 col-form-label">
                  <span style={{ marginRight: "15px" }}>&#215;</span> 32 GB unit{this.state.sqlStorage > 1 ? 's' : ''} = {this.state.sqlStorage * 32} GB storage in total
                </legend>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <label className="col-sm-6 col-form-label text-primary"><h5><strong>SQL database sub-total: &nbsp;US$&nbsp;
                  {this.getTotalDBPrice()} per month
                  </strong></h5>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>,
      <div className="card border-primary ">
        <header className="card-header text-white bg-primary ">Data transfer</header>
        <div className="card-body">
          <p>Data transfer within the same region is free of charge. As most of our infrastructure will be in the same region, they will not incur
            data transfer cost in everyday use. However, DR and backup servers are likely located in a different region, and therefore subject to
            data transfer charges. </p>
          <p>Current daily backup size is unknown due to an unspecified issue with the backup software. It is unlikely to exceed 2GB though. These data
            will be sent to both DR and backup servers, causing a 4GB data transfer.</p>
          <p>There are two applicable service schemes for data transfer: the generic <a href="https://azure.microsoft.com/en-gb/pricing/details/bandwidth/">Bandwidth</a> service or the dedicated <a href="https://azure.microsoft.com/en-gb/services/expressroute/">ExpressRoute</a> service. The latter,
            being a dedicated service, costs more but ensures fast and reliable private connections.</p>
          <form>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Service scheme</label>
              <div className="col-sm-4 slidecontainer">
                <select defaultValue={this.state.dataScheme} className="form-control" onChange={(e) => this.updateState(e, 'dataScheme')} >
                  <option value="1">Bandwidth</option>
                  <option value="2">ExpressRoute (50Mbps port speed)</option>
                  <option value="3">ExpressRoute (100Mbps port speed)</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Average daily data size</label>
              <div className="col-sm-9 slidecontainer">
                <input type="range" min="1" max="20" defaultValue={this.state.dataTransfer} className="slider centre"
                  onInput={(e) => this.updateDataSlider(e)} />
                <label className="centre">{this.state.dataTransfer}</label>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <label className="col-sm-6 col-form-label text-primary"><h5><strong>Data transfer sub-total: &nbsp;US$&nbsp;
                  {this.getTotalDTPrice()} per month
                  </strong></h5>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>,
      <div className="card border-primary ">
        <header className="card-header text-white bg-primary ">Miscellaneous</header>
        <div className="card-body">
          <table className="table table-striped" id="tblMisc">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Options</th>
                <th scope="col" className="text-primary">Price per month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Storage</th>
                <td>
                  <input type="number" className="form-control" min="1" style={{ width: '70px', display: 'inline' }}
                    value={this.state.fileStorage} onChange={(e) => this.updateState(e, 'fileStorage')} ></input> &nbsp;TB of &nbsp;
                  <select className="form-control" value={this.state.fileStorageType} onChange={(e) => this.updateState(e, 'fileStorageType')} style={{ width: '185px', display: 'inline' }}>
                    <option value="1">Block Blob Storage</option>
                    <option value="2">File Storage</option>
                  </select>
                  &nbsp;with GRS (geographically redundant storage)
                </td>
                <th className="text-primary">{this.getStoragePrice()}</th>
              </tr>
              <tr>
                <th scope="row">Backup</th>
                <td>
                  <input type="number" className="form-control" min="1" style={{ width: '70px', display: 'inline' }}
                    value={this.state.backupVMNum} onChange={(e) => this.updateState(e, 'backupVMNum')} ></input> &nbsp;&#215; VMs to be backed up&nbsp;
                  {this.renderInfoIcon("Assuming the average size of each VM backup to be 2GB and the retention period to be 7 years. This calculation \
                  already includes an estimation of the storage cost incurred for the retention of the records.")}
                </td>
                <th className="text-primary">{this.getBackupPrice()}</th>
              </tr>
              <tr>
                <th scope="row">Site Recovery</th>
                <td>
                  <input type="number" className="form-control" min="0" value={this.state.recoveryNum} onChange={(e) => this.updateState(e, 'recoveryNum')} style={{ width: '70px', display: 'inline' }}></input> &nbsp;&#215; instances to be recovered;
                  Recover to &nbsp;
                  <select className="form-control" value={this.state.recoveryType} onChange={(e) => this.updateState(e, 'recoveryType')} style={{ width: '205px', display: 'inline' }}>
                    <option value="1">cutomer-owned sites</option>
                    <option value="2">Azure</option>
                  </select>
                </td>
                <th className="text-primary">{this.getRecoveryPrice()}</th>
              </tr>
              <tr>
                <th scope="row">Firewall</th>
                <td>
                  <input type="number" className="form-control" min="0" style={{ width: '70px', display: 'inline' }}
                    value={this.state.firewallUnit} onChange={(e) => this.updateState(e, 'firewallUnit')} ></input> &nbsp;&#215; logical firewall unit{this.state.firewallUnit > 1 ? 's' : ''}
                </td>
                <th className="text-primary">{this.getFirewallPrice()}</th>
              </tr>
              <tr>
                <th scope="row">Support {this.renderInfoIcon("<h5>Developer</h5><p>Developer support is for companies or individuals using Azure in a non-production environment or for trial and evaluation.</p>\
                  <h5>Standard</h5><p>Standard support is for small or medium-sized companies with minimal business-critical dependence on Azure.</p>\
                  <h5>Professional Direct</h5><p>Professional Direct support is for medium-sized to large companies with substantial business-critical use of Azure.</p>")}</th>
                <td>
                  <select className="form-control" value={this.state.supportType} onChange={(e) => this.updateState(e, 'supportType')} style={{ width: '185px', display: 'inline' }}>
                    <option value="1">Included</option>
                    <option value="2">Developer</option>
                    <option value="3">Standard</option>
                    <option value="4">Professional Direct</option>
                  </select>
                </td>
                <th className="text-primary">{this.getSupportPrice()}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>,
      <div className="card border-dark ">
        <header className="card-header text-white bg-dark ">Estimated total monthly cost</header>
        <div className="card-body">
          <div className="row">
            <label className="col-sm-6 col-form-label text-dark"><h5><strong>&nbsp;US$&nbsp;
                {this.getTotalPrice()} per month
                </strong></h5>
            </label>
          </div>
        </div>
      </div>
    ];
  }
}

export default VM;
