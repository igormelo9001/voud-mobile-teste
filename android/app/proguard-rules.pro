# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Disabling obfuscation is useful if you collect stack traces from production crashes
# (unless you are using a system that supports de-obfuscate the stack traces).
#-dontobfuscate

# React Native

# Keep our interfaces so they can be used by other ProGuard rules.
# See http://sourceforge.net/p/proguard/bugs/466/
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}
-keep class io.invertase.firebase.** { *; }
-keep,includedescriptorclasses class * { native <methods>; }
-keep,includedescriptorclasses class * { @com.facebook.react.uimanager.UIProp <fields>; }
-keep,includedescriptorclasses class * { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keep,includedescriptorclasses class * { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }
-keep,includedescriptorclasses class com.facebook.react.uimanager.UIProp { *; }

-keep,includedescriptorclasses class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep,includedescriptorclasses class * extends com.facebook.react.bridge.NativeModule { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.CatalystInstanceImpl { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.JavaScriptExecutor { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.queue.NativeRunnable { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.ExecutorToken { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.ReadableType { *; }


-dontwarn io.invertase.firebase.**

-dontwarn com.facebook.react.**
-dontnote com.facebook.**

# TextLayoutBuilder uses a non-public Android constructor within StaticLayout.
# See libs/proxy/src/main/java/com/facebook/fbui/textlayoutbuilder/proxy for details.
-dontwarn android.text.StaticLayout

# okhttp

#-keepattributes Signature
#-keepattributes *Annotation*
#-keep class okhttp3.** { *; }
#-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# okio

#-keep class sun.misc.Unsafe { *; }
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**

# custom
# https://stackoverflow.com/questions/18646899/proguard-cant-find-referenced-class-com-google-android-gms-r
#-keep public class com.google.android.gms.* { public *; }
-dontwarn com.google.android.gms.**

-dontwarn **.**

# #####
# DATAMI
# #####
-keep class org.apache.http.** { *; }
-dontwarn org.apache.http.???

