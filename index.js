import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Platform, Picker, PickerIOS, DatePickerIOS, LayoutAnimation,
         StyleSheet } from 'react-native';

export default class SettingPickerIOS extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            value: '',
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.handleShowUnderlay = this.handleShowUnderlay.bind(this);
    }

    componentWillMount() {
        if (Platform.OS !== 'ios' && !__DEV__) {
            throw new Error('SettingPickerIOS is only supported in iOS');
        }

        // call to make sure child picker exists as only element
        getChildPicker(React.Children.only(this.props.children));
    }

    componentDidMount() {
        let picker = getChildPicker(React.Children.only(this.props.children)),
            val;

        switch (picker.type.name) {
            case 'PickerIOS':
            case 'Picker':
                let selVal = picker.props.selectedValue;
                val = picker.props.children.filter(c => c.props.value === selVal)[0].props.label;
                break;

            case 'DatePickerIOS':
                val = picker.props.date;
                break;
        }

        this.setState({
            value: val
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.expanded !== nextState.expanded) {
            var customLayoutEase = {
                    duration: 200,
                    update: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                        property: LayoutAnimation.Properties.scaleXY
                    }
                };

            LayoutAnimation.configureNext(customLayoutEase);
        }
    }

    handleValueChange(itemValue, itemPosition, picker) {
        this.setState({
            value: picker.children[itemPosition].props.label,
        });
    }

    handleDateChange(date) {
        this.setState({
            value: date
        });
    }

    handlePress() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    handleShowUnderlay() {
        var customLayoutEase = {
            duration: 200,
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            }
        };

        LayoutAnimation.configureNext(customLayoutEase);
    }

    render() {
        let picker = this.props.children,
            prevHandleChange,
            handleValChange;

        switch (picker.type.name) {
            case 'PickerIOS':
            case 'Picker':
                prevHandleChange = picker.props.onValueChange;
                let self = this;
                handleValChange = function (v, i) {
                    prevHandleChange(v, i);

                    // hacky workaround since I couldn't get ref to get called when setting it in cloneElement()
                    self.handleValueChange.call(self, v, i, this);
                };

                picker = React.cloneElement(picker, {onValueChange: handleValChange});
                break;

            case 'DatePickerIOS':
                prevHandleChange = picker.props.onDateChange;
                handleValChange = (d) => {
                    prevHandleChange(d);
                    this.handledateChange(d);
                };

                picker = React.cloneElement(picker, {onDateChange: handleValChange});
                break;
        }

        let valueTextStyles = [
            styles.valueText,
            this.props.textStyle,
        ];

        if (this.state.expanded) {
            valueTextStyles.push(styles.valueTextExpanded);
        }

        return (
            <View style={[styles.outerView, this.props.style]}>
                <TouchableHighlight onPress={this.handlePress} onShowUnderlay={this.handleShowUnderlay} underlayColor={underlayColor} >
                    <View style={styles.textView}>
                        <Text style={[styles.titleText, this.props.textStyle]}>{this.props.title}</Text>
                        <Text style={valueTextStyles}>{this.state.value}</Text>
                    </View>
                </TouchableHighlight>
                <View>
                    { this.state.expanded ? picker : null }
                </View>
            </View>
        );
    }
}

SettingPickerIOS.propTypes = {
    children: React.PropTypes.element.isRequired,
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

function getChildPicker(picker) {
    function isValidPicker(p) {
        const ValidPickerTypeNames = ['PickerIOS', 'Picker', 'DatePickerIOS'];
        return p &&
               ((p instanceof PickerIOS || p instanceof Picker || p instanceof DatePickerIOS) ||
                (picker.type && picker.type.name && ValidPickerTypeNames.includes(picker.type.name)));
    }

    // enable wrapping pickers
    while (picker && !isValidPicker(picker) && picker instanceof Component && picker.props.children.length === 1) {
        picker = picker.props.children[0];
    }

    if (!picker) {
        throw new Error('SettingPickerIOS\'s child must be a singleton PickerIOS, Picker, or DatePickerIOS.');
    }

    return picker;
}

const borderColor = 'rgb(200, 199, 204)';
const underlayColor = 'rgb(218, 218, 218)';

const styles = {
    outerView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 23,
        paddingRight: 36,
        paddingVertical: 15,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    titleText: {
        fontSize: 18,
        color: 'black',
        flex: 1,
    },
    valueText: {
        fontSize: 18,
        color: 'black',
    },
    valueTextExpanded: {
        color: 'red'
    },
};