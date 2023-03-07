package br.com.autopass.voud;

import android.app.Application;


import com.datami.smi.SdStateChangeListener;
import com.datami.smi.SmiResult;
import com.datami.smi.SmiSdk;
import com.datami.smisdk_plugin.SmiSdkReactModule;
import com.datami.smisdk_plugin.SmiSdkReactPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.uxcam.RNUxcamPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.realm.react.RealmReactPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactlibrary.RNAdyenCsePackage;
import iyegoroff.RNTextGradient.RNTextGradientPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;

import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements SdStateChangeListener, ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(
              new SmiSdkReactPackage(),
              new MainReactPackage(),
              new SvgPackage(),
              new RNUxcamPackage(),
              new RNFirebasePackage(),
              new SplashScreenReactPackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNFirebaseNotificationsPackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseInstanceIdPackage(),
              new RNFirebaseLinksPackage(),
              new FBSDKPackage(mCallbackManager),
              new RNDeviceInfo(),
              new MapsPackage(),
              new LinearGradientPackage(),
              new VectorIconsPackage(),
              new RNTextGradientPackage(),
              new RealmReactPackage(),
              new RNCameraPackage(),
              new RNAdyenCsePackage(),
              new RNFirebaseRemoteConfigPackage(),
              new RNFirebasePerformancePackage(),
              new RNFirebaseCrashlyticsPackage()

      );
    }
    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SmiSdk.initSponsoredData(getResources().getString(R.string.smisdk_apikey),
            this, null, R.mipmap.ic_launcher,
            getResources().getBoolean(R.bool.smisdk_show_messaging));
    SoLoader.init(this, false);
  }

  @Override
  public void onChange(SmiResult smiResult) {
    SmiSdkReactModule.setSmiResultToModule(smiResult);
  }

}
