import { sha256 } from "js-sha256";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import firebase from "react-native-firebase";
import publicIp from "react-native-public-ip";

// utils

/**
 * returns app build number
 * @return {Number} build number
 */
export const getBuildNumber = () => {
  const isAndroid = Platform.OS === "android";
  const buildNumber = DeviceInfo.getBuildNumber();
  // console.tron.log(buildNumber.toString());
  // Note - if it's Android platform, we remove architecture identifier first digit ("1" - armeabi-v7a, "2" - x86) from build number
  return Number(
    buildNumber && isAndroid ? buildNumber.toString().slice(1) : buildNumber
  );
};

export const getDeviceId = async () => {
  try {
    if (Platform.OS === "ios") {
      await firebase.messaging().requestPermission();
      const fcmToken = await firebase.messaging().getToken();
      return fcmToken;
    }

    if (__DEV__) {
      console.tron.log(`Android ID: ${DeviceInfo.getUniqueID()}`);
      console.tron.log(`Serial Number: ${DeviceInfo.getSerialNumber()}`);
    }
    return sha256(`${DeviceInfo.getUniqueID()}${DeviceInfo.getSerialNumber()}`);
  } catch (error) {
    if (__DEV__) console.tron.log(error, true);
    throw error;
  }
};

export const getDeviceModel = async () => {
  try {
    if (__DEV__) {
      console.tron.log(`Android ID: ${DeviceInfo.getUniqueID()}`);
      console.tron.log(`Serial Number: ${DeviceInfo.getSerialNumber()}`);
    }
    return DeviceInfo.getModel();
  } catch (error) {
    if (__DEV__) console.tron.log(error, true);
    throw error;
  }
};

export const getDeviceBrand = async () => {
  try {
    if (__DEV__) {
      console.tron.log(`Android ID: ${DeviceInfo.getUniqueID()}`);
      console.tron.log(`Serial Number: ${DeviceInfo.getSerialNumber()}`);
    }
    return DeviceInfo.getBrand();
  } catch (error) {
    if (__DEV__) console.tron.log(error, true);
    throw error;
  }
};

export const getDeviceIP = async () => {
  try {
    return publicIp();
  } catch (error) {
    if (__DEV__) console.tron.log(error, true);
    return "";
  }
};

export const isEmulator = () => {
  if (__DEV__) return false;
  return DeviceInfo.isEmulator();
};
