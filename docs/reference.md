# pm-dashboard-www 参考文档

- [pm-dashboard-www 参考文档](#pm-dashboard-www-参考文档)
  - [页面](#页面)
    - [Drawer](#drawer)
      - [Dashboard](#dashboard)
        - [输入卡片](#输入卡片)
        - [输出卡片](#输出卡片)
        - [电池卡片](#电池卡片)
        - [风扇卡片](#风扇卡片)
        - [CPU卡片](#cpu卡片)
        - [内存卡片](#内存卡片)
        - [网络卡片](#网络卡片)
        - [储存卡片](#储存卡片)
      - [History](#history)
      - [Log](#log)
    - [右上角菜单键](#右上角菜单键)
      - [OTA](#ota)
        - [自动升级](#自动升级)
        - [手动升级](#手动升级)
      - [Wi-Fi](#wi-fi)
      - [AP](#ap)
      - [Download History(暂缓)](#download-history暂缓)
      - [Settings](#settings)
  - [Peripherals](#peripherals)
  - [API](#api)
    - [GET /get-version 获取当前版本号](#get-get-version-获取当前版本号)
    - [GET /get-device-info 获取设备信息](#get-get-device-info-获取设备信息)
    - [GET /test 测试服务状态](#get-test-测试服务状态)
    - [GET /test-mqtt 测试MQTT连接](#get-test-mqtt-测试mqtt连接)
    - [GET /get-history 获取历史数据](#get-get-history-获取历史数据)
    - [GET /get-history-file 获取历史数据文件](#get-get-history-file-获取历史数据文件)
    - [GET /get-time-range 获取时间范围](#get-get-time-range-获取时间范围)
    - [GET /get-config 获取所有设置](#get-get-config-获取所有设置)
    - [GET /get-log-list 获取日志列表](#get-get-log-list-获取日志列表)
    - [GET /get-log 获取日志](#get-get-log-获取日志)
    - [GET /get-wifi-config 获取Wi-Fi配置](#get-get-wifi-config-获取wi-fi配置)
    - [GET /get-wifi-state](#get-get-wifi-state)
    - [GET /get-wifi-scan 获取Wi-Fi扫描列表](#get-get-wifi-scan-获取wi-fi扫描列表)
    - [GET /get-wifi-status 获取Wi-Fi状态](#get-get-wifi-status-获取wi-fi状态)
    - [GET /get-wifi-ip 获取Wi-Fi IP](#get-get-wifi-ip-获取wi-fi-ip)
    - [GET /get-ap-config 获取AP配置](#get-get-ap-config-获取ap配置)
    - [GET /get-timestamp 获取当前时间戳](#get-get-timestamp-获取当前时间戳)
    - [GET /get-default-on 获取是否默认开机](#get-get-default-on-获取是否默认开机)
    - [GET /get-output 获取输出状态](#get-get-output-获取输出状态)
    - [POST /set-config DEPRECATED](#post-set-config-deprecated)
    - [POST /set-output 设置输出](#post-set-output-设置输出)
    - [POST /set-wifi-config Wi-Fi配置](#post-set-wifi-config-wi-fi配置)
    - [POST /set-sta-switch Wi-Fi STA模式配置](#post-set-sta-switch-wi-fi-sta模式配置)
    - [POST /set-wifi-restart 重启Wi-Fi](#post-set-wifi-restart-重启wi-fi)
    - [POST /set-ap-config AP配置](#post-set-ap-config-ap配置)
    - [POST /set-ap-restart 重启AP](#post-set-ap-restart-重启ap)
    - [POST /ota-update OTA 更新](#post-ota-update-ota-更新)
    - [POST /set-shutdown-percentage 设置关机电池百分比](#post-set-shutdown-percentage-设置关机电池百分比)
    - [POST /set-power-off-percentage 设置断电电池百分比](#post-set-power-off-percentage-设置断电电池百分比)
    - [POST /set-auto-time 设置自动时间](#post-set-auto-time-设置自动时间)
    - [POST /set-timestamp 设置时间](#post-set-timestamp-设置时间)
    - [POST /set-timezone 设置时区](#post-set-timezone-设置时区)
    - [POST /set-ntp-server 设置NTP服务器](#post-set-ntp-server-设置ntp服务器)
    - [POST /set-restart 重启设备](#post-set-restart-重启设备)
    - [POST /set-fan-power 设置风扇功率](#post-set-fan-power-设置风扇功率)
    - [POST /set-sd-data-interval 设置SD卡数据间隔](#post-set-sd-data-interval-设置sd卡数据间隔)
    - [POST /set-sd-data-retain 设置SD卡数据保留天数](#post-set-sd-data-retain-设置sd卡数据保留天数)

## 页面

### Drawer

抽屉, 抽屉上面显示3个按钮，分别是Dashboard, History, Log。下面显示History和Log的列表。如果没有History和Log则不显示Drawer。

#### Dashboard

Dashboard按照peripheral显示卡片，从[`/get-history`](#get-get-history)获取20个数据, 并显示在卡片上。如果获取回来的只有1个数据, 需要拼接成20个数据。

##### 输入卡片

数据: 
1. 输入电压: 
    - 数据: `input_voltage`
    - peripheral: `input_voltage`
    - 显示图表
    - 单位: V
    - 最小值: 0
    - 最大值: 6
2. 输入电流: 
    - 数据: `input_current`
    - peripheral: `input_current`
    - 显示图表
    - 单位: A
    - 最小值: 0
    - 最大值: 6
3. 输入功率: 
    - 数据: `input_power`
    - peripheral: `input_power`
    - 显示图表
    - 单位: W
    - 最小值: 0
    - 最大值: 36
    - 计算公式: `input_voltage * input_current`
4. 输入是否插入: 
    - 数据: `is_input_plugged_in`
    - peripheral: `is_input_plugged_in`
    - Yes/No

##### 输出卡片

控件: 
1. 输出开关
    - 数据: `output_switch`
    - peripheral: `output_switch`
    - 控件类型: toggle 开关
    - 点击操作: 发送API [`/set-output`](#post-set-output)

数据: 
1. 输出电压: 
    - 数据: `output_voltage`
    - peripheral: `output_voltage`
    - 显示图表
    - 单位: V
    - 最小值: 0
    - 最大值: 6
2. 输出电流: 
    - 数据: `output_current`
    - peripheral: `output_current`
    - 显示图表
    - 单位: A
    - 最小值: 0
    - 最大值: 6
3. 输出功率: 
    - 数据: `output_power`
    - peripheral: `output_power`
    - 显示图表
    - 单位: W
    - 最小值: 0
    - 最大值: 36
    - 计算公式: `output_voltage * output_current`
4. 电源源: 
    - 数据: `power_source`
    - peripheral: `power_source`
    - Battery/External

##### 电池卡片

数据: 
1. 电池电压: 
    - 数据: `battery_voltage`
    - peripheral: `battery_voltage`
    - 显示图表
    - 单位: V
    - 最小值: 0
    - 最大值: 9
2. 电池电流: 
    - 数据: `battery_current`
    - peripheral: `battery_current`
    - 显示图表
    - 单位: A
    - 最小值: 0
    - 最大值: 6
3. 电池容量: 
    - 数据: `battery_capacity`
    - peripheral: `battery_capacity`
    - 显示图表
    - 单位: mAh
    - 最小值: 0
    - 最大值: 2200
4. 电池百分比: 
    - 数据: `battery_percentage`
    - peripheral: `battery_percentage`
    - 显示图表
    - 单位: %
    - 最小值: 0
    - 最大值: 100
5. 电池是否插入: 
    - 数据: `is_battery_plugged_in`
    - peripheral: `is_battery_plugged_in`
    - Yes/No
6. 是否正在充电: 
    - 数据: `is_charging`
    - peripheral: `is_charging`
    - Yes/No

##### 风扇卡片

数据: 
1. PWM风扇速度: 
    - 数据: `pwm_fan_speed`
    - peripheral: `pwm_fan_speed`
    - 显示图表
    - 单位: RPM
    - 最小值: 0
    - 最大值: 5000
2. 风扇功率: 
    - 数据: `spc_fan_power`
    - peripheral: `spc_fan_power`
    - 显示图表
    - 单位: %
    - 最小值: 0
    - 最大值: 100
3. GPIO风扇状态: 
    - 数据: `gpio_fan_state`
    - peripheral: `gpio_fan_state`
    - Yes/No
4. 温度: 
    - 数据: `temperature`
    - peripheral: `temperature`
    - 显示图表
    - 单位: `temperature_unit`
    - 最小值: 0
    - 最大值: 100

##### CPU卡片

待完成

##### 内存卡片

待完成

##### 网络卡片

待完成

##### 储存卡片

待完成

#### History

待完成

#### Log

待完成

### 右上角菜单键

#### OTA

点击打开OTA升级弹窗。根据`peripheral`判断显示自动升级和手动升级标签页。`ota_auto`和`ota_manual`。如果都没有则不显示OTA选项，如果有其中一个，则直接显示相应OTA页面。如果都有，则显示tab切换。

##### 自动升级

- 从API[`/get_version`](#get-get-version)获取当前版本号
- 显示当前版本号
- 从[github](https://api.github.com/repos/sunfounder/pironman-u1-firmware/releases/latest)返回的`tag_name`获取最新版本号，判断是否需要升级。如果有则显示立即升级按钮。没有则显示当前已是最新版。
- 升级按钮点击后，从上面返回的信息中用`assets[0].browser_download_url`下载最新文件后，发送[`/ota-update`](#post-ota-update)请求，显示进度条，进度条走完后显示升级完成和版本号。

##### 手动升级

- 选择文件输入框
- 立即升级按钮
- 点击后上传文件，发送[`/ota-update`](#post-ota-update)请求，显示进度条，进度条走完后显示升级完成和版本号。

#### Wi-Fi

Wi-Fi 设置弹窗，打开弹窗获取WiFi信息

- peripheral: `sta_switch`, `sta_ssid_scan`, `sta_ssid`, `sta_psk`
- 获取Wi-Fi当前设置API: [`/get-wifi-config`](#get-get-wifi-config)
- STA模式开关, peripheral 判断: `sta_switch`
- STA SSID下拉框, peripheral 判断: `sta_ssid_scan`
- 点击下拉请求: [`/get-wifi_scan`](#get-get-wifi-scan)
- STA 密码输入框（密码，最小8位）, peripheral 判断: `sta_psk`
- 取消按钮点击取消
- 确认按钮点击后发送API [`/set-wifi-config`](#post-set-wifi-config)
- 请求API [`get-wifi-state`](#get-get-wifi-state) 获取链接状态，如果成功则显示连接成功，否则显示连接失败
- 前端发送数据格式: `"STA": {"sta_ssid": "sta_ssid", "sta_psk": "sta_psk","sta_switch":"true"}`

#### AP

AP 设置弹窗，打开弹窗获取AP信息

- peripheral: `ap_ssid`, `ap_psk`
- 获取AP当前设置API: [`/get-ap-config`](#get-get-ap-config)
- AP SSID输入框, peripheral 判断: `ap_ssid`
- AP 密码输入框（密码，最小8位）, peripheral 判断: `ap_psk`
- 取消按钮点击取消
- 确认按钮点击后发送API [`/set-ap-config`](#post-set-ap-config)
- 前端发送数据格式: `"AP": {"ap_ssid": "ap_ssid", "ap_psk": "ap_psk""}`

#### Download History(暂缓)

下载历史数据，打开历史数据选择页面.

- peripheral: `download_history_file`
- 选择日期范围
- 点击下载按钮，循环发送API [`/get-history-file`](#get-get-history-file)下载文件,并打包成zip文件下载,文件名为`<device_id>-history-<start-date>-<end-date>.zip`, 例如`pironman-u1-history-2021-01-01-2021-01-31.zip`

#### Settings

设置弹窗，打开弹窗获取设置信息

- 获取设置API: [`/get-config`](#get-get-config)
- 主题设置
  - toggle 开关
  - 点击切换主题
- System分类
  - 温度单位设置
    - peripheral判断: `temperature_unit`
    - config分类: `system`
    - key: `temperature_unit`
    - toggle 开关
  - Shutdown Percentage
    - peripheral判断改为: `shutdown_percentage`
    - config分类: `system`
    - key: `shutdown_percentage`
    - 滑动条
    - 最小10%，最大100%
    - 描述: Without external input and if the battery voltage is below the set value, the device will send a shutdown request via I2C to protect the device and data. Note: Set the value to 100% for high current output.
  - Power Off Percentage
    - peripheral判断: `power_off_percentage`
    - config分类: `system`
    - key: `power_off_percentage`
    - 滑动条，类似Shutdown Percentage
    - 最小5%，最大 100%
    - 描述: If the battery voltage falls below the set value, the device will cut off the output to protect the battery.
  - 当前日期时间 Current Datetime
    - peripheral: `time`
    - config分类: `system`
    - key: `timestamp`
    - 显示当前时间日期
    - 手动设置时间按钮 Edit
      - 如果`auto_time_enable`peripheral是false或者`auto_time_enable`的值是false,才可用,否则变灰,无法点击.
      - 点击显示日期时间选择框
    - 通过API[`/get-timestamp`](#get-get-timestamp)获取当前时间, 需要不停的获取时间以更新时间.如果手动修改时间,则不再获取时间.
  - 时区选择 Timezone: 
    - peripheral: `timezone`
    - config分类: `system`
    - key: `timezone`
    - 下拉框选择,使用UTC时区格式如`UTC+8:00`
  - 自动设置时间 Auto Time Setting: 
    - peripheral: `auto_time_enable`
    - config分类: `system`
    - key: `auto_time_enable`
    - toggle 开关
  - NTP Server: 
    - 如果`auto_time_enable`的值是`true`才显示
    - peripheral: `auto_time_enable`
    - config分类: `system`
    - 子标题按照用户所在地区格式显示当前时间
    - 输入框加Sync Now按钮
      - 输入框填写ntp_server地址
      - 按键按下调api [`/set-time-sync`](#post-set-time-sync)
  - Mac地址
    - peripheral: mac_address
    - config分类: system
    - key: mac_address
    - 显示Mac地址
  - IP地址
    - peripheral: ip_address
    - config分类: system
    - key: ip_address
    - 显示IP地址
  - SD卡容量占用
  - peripheral: sd_card_usage
  - config分类: system
  - key: sd_card_usage
  - 条装图显示SD卡容量占用


## Peripherals

1. storage: 系统储存
2. cpu: 系统CPU信息
3. network: 网络状态
4. memory: 内存状态
5. history: 历史数据
6. log: 日志
7. input_voltage: 输入电压
8. input_current: 输入电流
9. output_switch: 输出开关
10. output_voltage: 输出电压
11. output_current: 输出电流
12. battery_voltage: 电池电压
13. battery_current: 电池电流
14. battery_capacity: 电池容量
15. battery_percentage: 电池百分比
16. power_source: 电池源
17. is_input_plugged_in: 输入是否插入
18. is_battery_plugged_in: 电池是否插入
19. is_charging: 是否正在充电
20. spc_fan_power: 风扇功率（%）
21. pwm_fan_speed: PWM风扇速度（RPM）
22. gpio_fan_state: GPIO风扇状态（bool）
23. shutdown_percentage: 关机百分比
24. power_off_percentage: 断电百分比
25. timezone: 时区
26. auto_time_enable: 自动时间开关
27. time: 时间
28. sta_switch: wifi 开关
29. sta_ssid_scan: Wi-Fi账号可搜索
30. sta_ssid: Wi-Fi账号
31. sta_psk: Wi-Fi密码
32. ap_ssid: AP账号
33. ap_psk: AP密码
34. ota_auto: 自动升级
35. ota_manual: 手动升级
36. mac_address: Mac地址
37. ip_address: IP地址
38. sd_card_usage: SD卡容量占用
39. download_history_file: 下载历史数据文件
40. default_on: 是否默认开机的选项
41. restart: 设备自己是否支持重启

## API

api地址: `http://ip:34001/api/v1.0`

### GET /get-version 获取当前版本号

- Response: 
  - `{"status": true, "data": "1.0.0"}`

### GET /get-device-info 获取设备信息

- Response: 
  ```json
  {
    "status": true,
    "data": {
      "name": "Pironman 5",
      "id": "pironman5",
      "peripherals": [
        "ws2812",
        "oled"
      ]
    }
  }
  ```

### GET /test 测试服务状态

- Response: 
  - `{"status": true, "data": "OK"}`

### GET /test-mqtt 测试MQTT连接

- Data: 
  - `host` - MQTT Broker Host
  - `port` - MQTT Broker Port
  - `username` - MQTT Broker Username
  - `password` - MQTT Broker Password
- Response: 
  - `{"status": true, "data": {"status": true, "error": null}}`
  - `{"status": true, "data": {"status": false, "error": "Timeout"}}`
  - `{"status": true, "data": {"status": false, "error": "Connection failed, Check hostname and port"}}`
  - `{"status": true, "data": {"status": false, "error": "Connection failed, Check username and password"}}`
  - `{"status": false, "error": "[ERROR] host not found"}`
  - `{"status": false, "error": "[ERROR] port not found"}`
  - `{"status": false, "error": "[ERROR] username not found"}`
  - `{"status": false, "error": "[ERROR] password not found"}`

### GET /get-history 获取历史数据

- Data:
  - `n` - Number of records to return
- Response:
  - `{"status": true, "data": []}`

### GET /get-history-file 获取历史数据文件

- Data:
  - `date` - Date in format `YYYY-MM-DD`
- Response:
  - file

### GET /get-time-range 获取时间范围
 
- Data:
  - `start` - Start time
  - `end` - End time
  - `key`(optional) - Key to filter
- Response:
  - `{"status": true, "data": []}`

### GET /get-config 获取所有设置

- Response:
```json
  {
    "status": true,
    "data": {
      "auto": {
        "reflash_interval": 1, //刷新间隔
        "retry_interval": 3, //刷新
        "fan_mode": "auto",
        "fan_state": true,
        "fan_speed": 65,
        "rgb_switch": true,
        "rgb_style": "breath",  // 'breath', 'leap', 'flow', 'raise_up', 'colorful'
        "rgb_color": "#0a1aff",
        "rgb_speed": 50, //速度
        "rgb_pwm_frequency": 1000, //频率
        "rgb_pin": 10,  // 10,12,21,
      },
      "mqtt": {
        "host": "core-mosquitto",
        "port": 1883,
        "username": "mqtt",
        "password": "mqtt"
      },
      "dashboard": {
        "ssl": false,
        "ssl_ca_cert": "",
        "ssl_cert": ""
      },
      "system": {
        "temperature_unit": "C",
        "shutdown_percentage": 100,  //关机策略
        "power_off_percentage": 100,  //电池保护策略
        "timestamp": "16552455",
        "timezone": "UTC-08:00",
        "auto_time_enable": false,
        "ntp_server": "",
        "mac_address": "",
        "ip_address": "",
        "sd_card_usage": 0,
        "sd_card_total": 0,
        "sd_card_data_interval": 60, // SD 卡存数据的时间间隔，单位秒
        "sd_card_data_retain": 7, // SD 卡存数据保留天数，单位天
        "fan_power": 0,
        "gpio_fan_mode": 1,
      }
    }
  }
```

### GET /get-log-list 获取日志列表

- Response:
  - `{"status": true, "data": []}`

### GET /get-log 获取日志

- Data:
  - `filename` - Log file name
  - `lines`(optional) - Number of records to return
  - `filter`(optional) - Filter, divided by comma
  - `level`(optional) - Log level `['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']`
- Response:
  - `{"status": false, "error": "[ERROR] file not found"}`
  - `{"status": true, "data": []}`

### GET /get-wifi-config 获取Wi-Fi配置

- Response:
  - `{"status": true, "data": {"sta_switch": true, "sta_ssid": "SSID","sta_psk": "password"}}`

### GET /get-wifi-state

- Description: Get Wi-Fi state
- Response:
  - `{"status": true, "data": "connected"}`
  - `{"status": true, "data": "disconnected"}`
  - `{"status": true, "data": "connecting"}`

### GET /get-wifi-scan 获取Wi-Fi扫描列表

- Response:
  - `{"status": true, "data": ["SSID1", "SSID2"]}` 

### GET /get-wifi-status 获取Wi-Fi状态

- Response:
  - `{"status": true, "data": "0"}` IDLE_STATUS
  - `{"status": true, "data": "1"}` NO_SSID_AVAIL
  - `{"status": true, "data": "2"}` SCAN_COMPLETED
  - `{"status": true, "data": "3"}` CONNECTED
  - `{"status": true, "data": "4"}` CONNECT_FAILED
  - `{"status": true, "data": "5"}` CONNECTION_LOST
  - `{"status": true, "data": "6"}` DISCONNECTED

### GET /get-wifi-ip 获取Wi-Fi IP

- Response:
  - `{"status": true, "data": "192.168.1.1"}`

### GET /get-ap-config 获取AP配置

- Response:
  - `{"status": true, "data": {"ap_ssid": "SSID", "ap_psk": "password"}}`

### GET /get-timestamp 获取当前时间戳

- Response:
  - `{"status": true, "data": "1612137600"}`

### GET /get-default-on 获取是否默认开机

- Response:
  - `{"status": true, "data": "true"}`

### GET /get-output 获取输出状态

- Response:
  - `{"status": true, "data": 0}` -  0/1/2: Power off 断电/Shutdown 关机/Power on 开机

### POST /set-config DEPRECATED

- Description: Set configuration
- Data:
  - `data` - Configuration data
- Response:
  - `{"status": true, "data": data}`

### POST /set-output 设置输出

- Data:
  - `switch` - Output switch 0/1/2: Power off 断电/Shutdown 关机/Power on 开机

- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-wifi-config Wi-Fi配置
- Data:
  - `sta_switch` - Wi-Fi switch 0/1
  - `sta_ssid` - Wi-Fi SSID
  - `sta_psk` - Wi-Fi password
- Response:
  - `{"status": true, "data": "OK"}`
### POST /set-sta-switch Wi-Fi STA模式配置
- Data:
  - `sta_switch` - Wi-Fi switch 0/1
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-wifi-restart 重启Wi-Fi

- Response:　没有返回

### POST /set-ap-config AP配置

- Data:
  - `ap_ssid` - AP SSID
  - `ap_psk` - AP password
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-ap-restart 重启AP

- Response:　没有返回

### POST /ota-update OTA 更新

- Data:
  - `file` - OTA file
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-shutdown-percentage 设置关机电池百分比

- Data:
  - `shutdown-percentage` - 百分比
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-power-off-percentage 设置断电电池百分比

- Data:
  - `power-off-percentage` - 百分比
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-auto-time 设置自动时间

- Data:
  - `enable` - 自动时间开关 true/false
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-timestamp 设置时间

- Data:
  - `timestamp` - 时间戳（秒）
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-timezone 设置时区

- Data:
  - `timezone` - 时区
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-ntp-server 设置NTP服务器

- Data:
  - `ntp_server` - NTP服务器
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-restart 重启设备

- Response:　没有返回

### POST /set-fan-power 设置风扇功率

- Data:
  - `fan_power` - 风扇功率
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-sd-data-interval 设置SD卡数据间隔

- Data:
  - `data_interval` - 数据间隔，单位秒
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-sd-data-retain 设置SD卡数据保留天数

- Data:
  - `data_retain` - 数据保留天数，单位天
- Response:
  - `{"status": true, "data": "OK"}`
