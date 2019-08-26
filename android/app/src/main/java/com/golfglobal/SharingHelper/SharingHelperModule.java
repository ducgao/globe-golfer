package com.golfglobal.SharingHelper;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class SharingHelperModule extends ReactContextBaseJavaModule {
    public SharingHelperModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "SharingHelperModule";
    }

    @ReactMethod
    public void shareTo(String phoneList, String content) {
        Intent smsIntent = new Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:" + phoneList));
        smsIntent.putExtra("sms_body", content);
        smsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(smsIntent);
    }
}
