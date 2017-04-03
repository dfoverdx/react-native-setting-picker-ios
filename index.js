import React, { Component } from 'react';
import { View, Text, TouchableHighlihght, Platform, Picker, PickerIOS, DatePickerIOS, LayoutAnimation, StyleSheet } from 'react-native';

export default class SettingPickerIOS extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            value: '',
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handlePress = this.handlePress.bind(this);
    }

    componentWillMount() {
        if (Platform.OS !== 'ios') {
            throw new Error('SettingPickerIOS is only supported in iOS');
        }
    }

    componentDidMount() {
        let picker = this.props.children,
            val;
        switch (getChildElementType(picker)) {
            case 'PickerIOS':
            case 'Picker':
                val = picker.selectedValue;
                break;

            case 'DatePickerIOS':
                val = picker.date;
                break;
        }

        this.setState({
            value: val
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.expanded !== nextState.expanded) {
            var customLayoutLinear = {
                    duration: 75,
                    update: {
                        type: LayoutAnimation.Types.linear,
                        property: LayoutAnimation.Properties.scaleXY
                    }
                };

            LayoutAnimation.configureNext(customLayoutLinear);
        }
    }

    handleValueChange(value) {
        this.state.setState({
            value: value,
        });
    }

    handlePress() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        let picker = this.props.children;
        switch (getChildElementType(picker)) {
            case 'PickerIOS':
            case 'Picker':
                picker.onValueChange = handleValueChange;
                break;
            case 'DatePickerIOS':
                picker.onDateChange = handleValueChange;
                break;
        }

        let valueTextStyles = [
            styles.valueText,
            this.props.textStyle,
        ];

        if (!this.state.expanded) {
            valueTextStyles.push(styles.valueTextExpanded);
        }

        return (
            <View style={[styles.outerView, this.props.style]}>
                <TouchableHighlihght onPress={this.handlePress}>
                    <View style={styles.textView}>
                        <Text style={[styles.titleText, this.props.textStyle]}>{this.props.title}</Text>
                        <Text style={valueTextStyles}>{this.state.value}</Text>
                    </View>
                </TouchableHighlihght>
                <View style={[styles.pickerView]}>
                    { this.state.expanded ? picker : null }
                </View>
            </View>
        );
    }
}

SettingPickerIOS.propTypes = {
    children: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Picker),
            React.PropTypes.instanceOf(PickerIOS),
            React.PropTypes.instanceOf(DatePickerIOS),
        ]).isRequired,
    title: React.PropTypes.string.isRequired,
    style: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(StyleSheet),
            React.PropTypes.object,
        ]),
    textStyle: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(StyleSheet),
            React.PropTypes.object,
        ]),
};

const borderColor = 'rgb(200, 199, 204)';

const styles = {
    outerView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: borderColor,
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
    },
    titleText: {
        fontSize: 16,
        color: 'black',
    },
    valueText: {
        fontSize: 16,
        color: 'black',
    },
    valueTextExpanded: {
        color: 'red'
    },
    pickerView: {
        borderTopWidth: 1,
        borderColor: borderColor,
    },
};

function getChildElementType(picker) {
    return picker.type.name;
}