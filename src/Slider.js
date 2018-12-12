import React, { Component } from 'react';

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            value: props.value,
            name: props.name,
            val: props.value
        };
    }

    updateSlider = (id, t) => {
        var slider = document.getElementById(id);
        slider.oninput = function () {
            slider.value = this.value;
            t.setState({ val: this.value });
            t.props.onSlide(t.state.id, this.value);
        }
    }

    render() {
        return (
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">{this.state.name} spec</label>
                <div className="col-sm-10 slidecontainer">
                    <input type="range" min="1" max="150" defaultValue={this.state.value} className="slider centre"
                        id={this.state.name + "Range"} onInput={() => this.updateSlider(this.state.name + "Range", this)} />
                    <label className="centre">{this.state.val}</label>
                </div>
            </div>
        )
    }
}

export default Slider;