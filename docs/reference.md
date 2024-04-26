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
    - [GET /get-version](#get-get-version)
    - [GET /get-device-info](#get-get-device-info)
    - [GET /test](#get-test)
    - [GET /test-mqtt](#get-test-mqtt)
    - [GET /get-history](#get-get-history)
    - [GET /get-history-file](#get-get-history-file)
    - [GET /get-time-range](#get-get-time-range)
    - [GET /get-config](#get-get-config)
    - [GET /get-log-list](#get-get-log-list)
    - [GET /get-log](#get-get-log)
    - [GET /get-wifi-config](#get-get-wifi-config)
    - [GET /get-wifi-scan](#get-get-wifi-scan)
    - [GET /get-ap-config](#get-get-ap-config)
    - [GET /get-timestamp](#get-get-timestamp)
    - [POST /set-config](#post-set-config)
    - [POST /set-output](#post-set-output)
    - [POST /set-wifi-config](#post-set-wifi-config)
    - [POST /set-ap-config](#post-set-ap-config)
    - [POST /ota-update](#post-ota-update)
    - [POST /set-time-sync](#post-set-time-sync)


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

## API

api地址: `http://ip:34001/api/v1.0`

### GET /get-version

- Description: 获取当前版本号
- Response: 
  - `{"status": true, "data": "1.0.0"}`

### GET /get-device-info

- Description: Get device information
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

### GET /test

- Description: Test if the server is running
- Response: 
  - `{"status": true, "data": "OK"}`

### GET /test-mqtt

- Description: Test if the MQTT configuration is correct
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

### GET /get-history

- Description: Get history
- Data:
  - `n` - Number of records to return
- Response:
  - `{"status": true, "data": []}`

### GET /get-history-file

- Description: Get day history file
- Data:
  - `date` - Date in format `YYYY-MM-DD`
- Response:
  - file

### GET /get-time-range

- Description: Get time range
- Data:
  - `start` - Start time
  - `end` - End time
  - `key`(optional) - Key to filter
- Response:
  - `{"status": true, "data": []}`

### GET /get-config

- Description: Get configuration
- Response:
  - `{"status": true, "data": {}`

### GET /get-log-list

- Description: Get log list
- Response:
  - `{"status": true, "data": []}`

### GET /get-log

- Description: Get log
- Data:
  - `filename` - Log file name
  - `lines`(optional) - Number of records to return
  - `filter`(optional) - Filter, divided by comma
  - `level`(optional) - Log level `['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']`
- Response:
  - `{"status": false, "error": "[ERROR] file not found"}`
  - `{"status": true, "data": []}`

### GET /get-wifi-config

- Description: Get Wi-Fi configuration
- Response:
  - `{"status": true, "data": {"sta_switch": true, "sta_ssid": "SSID","sta_psk": "password"}}`

### GET /get-wifi-scan

- Description: Get Wi-Fi scan list
- Response:
  - `{"status": true, "data": ["SSID1", "SSID2"]}` 

### GET /get-ap-config

- Description: Get AP configuration
- Response:
  - `{"status": true, "data": {"ap_ssid": "SSID", "ap_psk": "password"}}`

### GET /get-timestamp

- Description: Get current timestamp
- Response:
  - `{"status": true, "data": "1612137600"}`

### POST /set-config

- Description: Set configuration
- Data:
  - `data` - Configuration data
- Response:
  - `{"status": true, "data": data}`

### POST /set-output

- Description: Set output
- Data:
  - `switch` - Output switch 0/1
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-wifi-config

- Description: Set Wi-Fi configuration
- Data:
  - `sta_switch` - Wi-Fi switch 0/1
  - `sta_ssid` - Wi-Fi SSID
  - `sta_psk` - Wi-Fi password
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-ap-config

- Description: Set AP configuration
- Data:
  - `ap_ssid` - AP SSID
  - `ap_psk` - AP password
- Response:
  - `{"status": true, "data": "OK"}`

### POST /ota-update

- Description: OTA Update
- Data:
  - `file` - OTA file
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-time-sync

- Description: Set time sync
- Data:
  - `ntp_server` - NTP Server