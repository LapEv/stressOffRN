import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  PanResponder,
  Animated,
} from 'react-native';

// var Dimensions = require('Dimensions');
// var SCREEN_WIDTH = useWindowDimensions().width;
// var SCREEN_HEIGHT = useWindowDimensions().height;

export var SlideDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  BOTH: 'both',
};

export class SlideButton extends Component {
  _isTimeOut = false;

  constructor(props) {
    super(props);
    this.buttonWidth = 0;
    this.state = {
      initialX: 0,
      locationX: 0,
      dx: 0,
      animatedX: new Animated.Value(0),
      released: false,
      swiped: true,
    };
    this._isMounted = true;

    var self = this;

    // TODO: Raise error if slideDirection prop is invalid.

    this.panResponder = PanResponder.create({
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return dx > 2 || dx < -2 || dy > 2 || dy < -2;
      },
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return dx > 2 || dx < -2 || dy > 2 || dy < -2;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},

      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) return;
        self.setState({
          locationX: evt.nativeEvent.locationX,
          dx: gestureState.dx,
        });
        self.onSlide(gestureState.dx);
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (this.isSlideSuccessful()) {
          // Move the button out
          this.moveButtonOut(() => {
            self.setState({swiped: true});
            self.props.onSlideSuccess();
          });

          // Slide it back in after 1 sec
          this._isTimeOut = setTimeout(() => {
            self.moveButtonIn(() => {
              self.setState({
                released: false,
                dx: self.state.initialX,
              });
            });
          }, 2000);
        } else {
          this.snapToPosition(() => {
            self.setState({
              released: false,
              dx: self.state.initialX,
            });
          });
        }
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.snapToPosition(() => {
          self.setState({
            released: false,
            dx: self.state.initialX,
          });
        });
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from
        // becoming the JS responder. Returns true by default. Is currently only
        // supported on android.
        return true;
      },
    });
  }

  /* Button movement of > 40% is considered a successful slide */
  isSlideSuccessful() {
    if (!this.props.slideDirection) {
      return this.state.dx > this.buttonWidth * 0.2; // Defaults to right slide
    } else if (this.props.slideDirection === SlideDirection.RIGHT) {
      return this.state.dx > this.buttonWidth * 0.2;
    } else if (this.props.slideDirection === SlideDirection.LEFT) {
      return this.state.dx < -(this.buttonWidth * 0.2);
    } else if (this.props.slideDirection === SlideDirection.BOTH) {
      return Math.abs(this.state.dx) > this.buttonWidth * 0.2;
    }
  }

  onSlide(x) {
    if (this.props.onSlide) {
      this.props.onSlide(x);
    }
  }

  onSlideSuccess() {
    if (this.props.onSlideSuccess !== undefined) {
      this.props.onSlideSuccess();
    }
  }

  measureButton() {
    var self = this;
    this.refs.button.measure((ox, oy, width, height) => {
      self.setState({
        initialX: ox,
        buttonWidth: width,
      });
    });
  }

  moveButtonIn(onCompleteCallback) {
    var self = this;
    var startPos =
      this.state.dx >= 0
        ? this.state.initialX + this.buttonWidth * 0.2
        : this.state.initialX - this.buttonWidth * 0.2;
    var endPos = this.state.initialX;

    this.setState(
      {
        released: true,
        animatedX: new Animated.Value(startPos),
      },
      () => {
        Animated.timing(self.state.animatedX, {
          toValue: endPos,
          useNativeDriver: false,
        }).start(onCompleteCallback);
      },
    );
  }

  moveButtonOut(onCompleteCallback) {
    var self = this;
    var startPos = this.state.initialX + this.state.dx;
    var endPos =
      this.state.dx < 0 ? -this.buttonWidth * 0.2 : this.buttonWidth * 0.2;

    this.setState(
      {
        released: true,
        animatedX: new Animated.Value(startPos),
      },
      () => {
        Animated.timing(self.state.animatedX, {
          toValue: endPos,
          useNativeDriver: false,
        }).start(onCompleteCallback);
      },
    );
  }

  snapToPosition(onCompleteCallback) {
    var self = this;
    var startPos = this.state.initialX + this.state.dx;
    var endPos = this.state.initialX;

    this.setState(
      {
        released: true,
        animatedX: new Animated.Value(startPos),
      },
      () => {
        Animated.timing(self.state.animatedX, {
          toValue: endPos,
          useNativeDriver: false,
        }).start(onCompleteCallback);
      },
    );
  }

  onLayout(event) {
    this.buttonWidth = event.nativeEvent.layout.width;
    this.setState({
      initialX: event.nativeEvent.layout.x,
    });
  }

  componentWillUnmount() {
    if (this._isTimeOut) {
      clearTimeout(this._isTimeOut);
      this._isTimeOut = false;
    }
  }

  render() {
    var style = [styles.button, this.props.style, {left: this.state.dx}];

    if (this.state.released) {
      style = [styles.button, this.props.style, {left: this.state.animatedX}];
      var button = (
        <Animated.View style={style}>{this.props.children}</Animated.View>
      );
    } else {
      var button = (
        <View style={style}>
          <View onLayout={this.onLayout.bind(this)}>{this.props.children}</View>
        </View>
      );
    }

    return (
      <View
        ref="button"
        style={styles.container}
        {...this.panResponder.panHandlers}>
        {button}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
  },
});
