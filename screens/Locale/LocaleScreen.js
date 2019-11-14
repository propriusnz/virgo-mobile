import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Radio, RadioGroup, CheckBox, Button } from "react-native-ui-kitten";
import StyledTitle from "../../components/StyledTitle";
import { connect } from "react-redux";
import { localeList } from "../../constants/locale/setting";
import { setLocale } from "../../action/index";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import * as Localization from "expo-localization";
import { withTranslation } from "react-i18next";
import i18next from "i18next";

class LocaleScreen extends Component {
  state = {
    checkAuk: true
  };

  static navigationOptions = {
    header: null
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();

    // return fetch(PUSH_ENDPOINT, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     token: {
    //       value: token,
    //     },
    //     user: {
    //       username: 'Brent',
    //     },
    //   }),
    // });
  };

  radioOnChange = index => {
    this.props.setLocale(index);
    if (index === 0) {
      i18next.changeLanguage("en");
    } else if (index === 1) {
      i18next.changeLanguage("ch");
    } else {
      i18next.changeLanguage("en");
    }
  };

  componentDidMount = () => {
    this.registerForPushNotificationsAsync();
  };

  render() {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <StyledTitle title="Virgo's Resurrection" />

        <View>
          <Text style={styles.chooseOptions}>{t("localePage.cl")}</Text>
        </View>

        <RadioGroup
          selectedIndex={this.props.localeIndex}
          onChange={index => {
            this.radioOnChange(index);
          }}
        >
          {localeList.map((el, index) => (
            <Radio style={styles.item} text={el} key={index} />
          ))}
        </RadioGroup>

        <View>
          <Text style={styles.chooseOptions}>{t("localePage.sys")}</Text>
          <CheckBox
            style={styles.item}
            text="AUCKLAND"
            checked={this.state.checkAuk}
            onChange={this.storeOnChange}
          />
        </View>

        <Button
          size="medium"
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate("Main");
          }}
        >
          {t("confirm")}
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginHorizontal: 44
  },
  chooseOptions: {
    marginTop: 25,
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "100"
  },
  item: {
    marginVertical: 6
  },
  button: {
    backgroundColor: "black",
    marginTop: 120,
    flex: 1,
    borderRadius: 10,
    width: "100%"
  }
});

const mapStateToProps = state => {
  return { localeIndex: state.localeReducer.localeIndex };
};

const mapDispatchToProps = dispatch => ({
  setLocale: index => {
    dispatch(setLocale(index));
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(LocaleScreen)
);
