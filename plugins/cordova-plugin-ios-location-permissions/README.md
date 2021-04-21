## iOS 11 Location Permissions Plugin for Apache Cordova

**Cordova / PhoneGap Plugin Permission Settings for NSLocationWhenInUseUsageDescription and NSLocationAlwaysAndWhenInUseUsageDescription in iOS 11 by adding a declaration to the Info.plist file**

## Install

#### Latest published version on npm (with Cordova CLI >= 5.0.0)

```
cordova plugin add cordova-plugin-ios-location-permissions --save
```

#### Latest version from GitHub

```
cordova plugin add https://github.com/niconaso/cordova-plugin-ios-location-permissions.git --save
```

#### Customising the message prompts

On installation you can customise the prompts shown by setting the following variables on installation.

- LOCATION_WHEN_IN_USAGE_DESCRIPTION for NSLocationWhenInUseUsageDescription
- LOCATION_ALWAYS_AND_WHEN_IN_USAGE_DESCRIPTION for NSLocationAlwaysAndWhenInUseUsageDescription


For example:
```
cordova plugin add cordova-plugin-ios-location-permissions --variable LOCATION_WHEN_IN_USAGE_DESCRIPTION="your usage message" --variable LOCATION_ALWAYS_AND_WHEN_IN_USAGE_DESCRIPTION="your usage message" --save
```

## Usage

For the changes to `plugin.xml` to take effect, you must refresh the `ios.json` file (inside the `/plugin` folder):
```
$ cordova platform rm ios
$ cordova platform add ios
```

## Platforms

Applies to iOS 10/11 only.

## License

[MIT License]
