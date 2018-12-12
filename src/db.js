import React, { Component } from 'react';
import './common.css';
import './appFunctions.js';

class DB extends Component {

    render() {
        return (
            <div className="card">
                <header className="card-header">
                    SQL Database
                </header>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <div className="row">
                                <legend className="col-sm-2 col-form-label">Billing option</legend>
                                <div className="col-sm-10">
                                    <input type="input" className="form-control" name="vmTransac" id="vmTransac"></input>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default DB;
