# pm-dashboard-www 参考文档

- [pm-dashboard-www 参考文档](#pm-dashboard-www-参考文档)
  - [页面](#页面)
    - [Drawer 抽屉](#drawer-抽屉)
      - [Dashboard](#dashboard)
        - [输入卡片](#输入卡片)
        - [输出卡片](#输出卡片)
        - [电池卡片](#电池卡片)
        - [温度卡片](#温度卡片)
        - [CPU卡片](#cpu卡片)
        - [内存卡片](#内存卡片)
        - [网络卡片](#网络卡片)
        - [储存卡片](#储存卡片)
      - [History](#history)
      - [Log](#log)
      - [选项区域](#选项区域)
        - [Log 文件条目](#log-文件条目)
    - [右上角菜单键](#右上角菜单键)
      - [OTA](#ota)
        - [自动升级](#自动升级)
        - [手动升级](#手动升级)
      - [Wi-Fi](#wi-fi)
      - [AP](#ap)
      - [Download History(暂缓)](#download-history暂缓)
      - [Settings](#settings)
  - [Peripherals](#peripherals)
  - [Config](#config)
  - [API](#api)
    - [GET /get-version](#get-get-version)
    - [GET /get-device-info](#get-get-device-info)
    - [GET /test](#get-test)
    - [GET /test-mqtt](#get-test-mqtt)
    - [GET /get-data](#get-get-data)
    - [GET /get-history DEPRECATED](#get-get-history-deprecated)
    - [GET /get-history-file](#get-get-history-file)
    - [GET /get-time-range](#get-get-time-range)
    - [GET /get-config](#get-get-config)
    - [GET /get-log-list](#get-get-log-list)
    - [GET /get-log](#get-get-log)
    - [GET /get-wifi-config](#get-get-wifi-config)
    - [GET /get-wifi-state](#get-get-wifi-state)
    - [GET /get-wifi-scan](#get-get-wifi-scan)
    - [GET /get-wifi-status](#get-get-wifi-status)
    - [GET /get-wifi-ip](#get-get-wifi-ip)
    - [GET /get-ap-config](#get-get-ap-config)
    - [GET /get-timestamp](#get-get-timestamp)
    - [GET /get-default-on](#get-get-default-on)
    - [GET /get-output](#get-get-output)
    - [GET /get-disk-list](#get-get-disk-list)
    - [GET /get-network-interface-list](#get-get-network-interface-list)
    - [POST /clear-history](#post-clear-history)
    - [POST /delete-log-file](#post-delete-log-file)
    - [POST /set-config DEPRECATED](#post-set-config-deprecated)
    - [POST /set-temperature-unit](#post-set-temperature-unit)
    - [POST /set-output](#post-set-output)
    - [POST /set-wifi-config](#post-set-wifi-config)
    - [POST /set-sta-switch](#post-set-sta-switch)
    - [POST /set-wifi-restart](#post-set-wifi-restart)
    - [POST /set-ap-config](#post-set-ap-config)
    - [POST /set-ap-restart](#post-set-ap-restart)
    - [POST /ota-update](#post-ota-update)
    - [POST /set-shutdown-percentage](#post-set-shutdown-percentage)
    - [POST /set-power-off-percentage](#post-set-power-off-percentage)
    - [POST /set-auto-time](#post-set-auto-time)
    - [POST /set-timestamp](#post-set-timestamp)
    - [POST /set-timezone](#post-set-timezone)
    - [POST /set-ntp-server](#post-set-ntp-server)
    - [POST /set-restart](#post-set-restart)
    - [POST /set-fan-led](#post-set-fan-led)
    - [POST /set-fan-power](#post-set-fan-power)
    - [POST /set-fan-mode](#post-set-fan-mode)
    - [POST /set-sd-data-interval](#post-set-sd-data-interval)
    - [POST /set-sd-data-retain](#post-set-sd-data-retain)
    - [POST /set-rgb-brightness](#post-set-rgb-brightness)
    - [POST /set-rgb-color](#post-set-rgb-color)
    - [POST /set-rgb-enable](#post-set-rgb-enable)
    - [POST /set-rgb-led-count](#post-set-rgb-led-count)
    - [POST /set-rgb-speed](#post-set-rgb-speed)
    - [POST /set-rgb-style](#post-set-rgb-style)
    - [POST /set-rgb-matrix-enable](#post-set-rgb-matrix-enable)
    - [POST /set-rgb-matrix-style](#post-set-rgb-matrix-style)
    - [POST /set-rgb-matrix-color](#post-set-rgb-matrix-color)
    - [POST /set-rgb-matrix-color2](#post-set-rgb-matrix-color2)
    - [POST /set-rgb-matrix-brightness](#post-set-rgb-matrix-brightness)
    - [POST /set-rgb-matrix-speed](#post-set-rgb-matrix-speed)
    - [POST /set-oled-sleep-timeout](#post-set-oled-sleep-timeout)
    - [POST /set-oled-enable](#post-set-oled-enable)
    - [POST /set-oled-disk](#post-set-oled-disk)
    - [POST /set-oled-network-interface](#post-set-oled-network-interface)
    - [POST /set-oled-rotation](#post-set-oled-rotation)
    - [POST /set-oled-pages](#post-set-oled-pages)
    - [POST /set-send-email-on](#post-set-send-email-on)
    - [POST /set-send-email-to](#post-set-send-email-to)
    - [POST /set-smtp-server](#post-set-smtp-server)
    - [POST /set-smtp-port](#post-set-smtp-port)
    - [POST /set-smtp-email](#post-set-smtp-email)
    - [POST /set-smtp-password](#post-set-smtp-password)
    - [POST /set-smtp-security](#post-set-smtp-security)
    - [GET /test-smtp](#get-test-smtp)
    - [POST /start-ups-power-failure-simulation](#post-start-ups-power-failure-simulation)
    - [GET /get-ups-power-failure-simulation](#get-get-ups-power-failure-simulation)
    - [GET /get-disk-list](#get-get-disk-list-1)
    - [POST /set-debug-level](#post-set-debug-level)
    - [POST /set-restart-service](#post-set-restart-service)
  - [Settings](#settings-1)
    - [System](#system)

## 页面

### Drawer 抽屉

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

##### 温度卡片

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
4. CPU温度: 
    - 数据: `cpu_temperature`
    - peripheral: `cpu_temperature`
    - 显示图表
    - 单位: `temperature_unit`
    - 最小值: 0
    - 最大值: 125
5. GPU温度：
    - 数据: `gpu_temperature`
    - peripheral: `gpu_temperature`
    - 显示图表
    - 单位: `temperature_unit`
    - 最小值: 0
    - 最大值: 125

##### CPU卡片

数据: 
1. CPU占用: 
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

#### 选项区域

选项区域根据上面的选项切换显示。History页面显示所有数据条目，Log页面显示所有日志条目。

##### Log 文件条目

Log文件条目列表，显示log名称和所属模块。右边有删除按钮，点击按钮弹窗确认删除。

删除API: [`/delete-log-file`](#post-delete-log-file)

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
- 储存卡片显示未挂载硬盘
  - toggle 开关
  - 点击切换是否显示未挂载硬盘
- 处理器卡片显示多核信息
  - toggle 按键组：合并/多核
  - 点击切换是否显示多核信息
- 电池输出警告：在切换到电池输出时，显示警告信息
  - toggle 开关
  - 点击切换是否显示电池输出警告
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
  - 数据间隔
    - peripheral: `data_interval`
    - config分类: `system`
    - key: `data_interval`
    - 输入框
    - 最小1秒，最大3600秒
    - 描述: The interval between data uploads.
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
  - Debug level
    - peripheral: debug_level
    - 下拉框选择：
      - DEBUG
      - INFO
      - WARNING
      - ERROR
      - CRITICAL
    - api: [`/set-debug-level`](#post-set-debug-level)
  - RGB点阵分类
    - RGB点阵开关
      - peripheral: rgb_matrix
      - toggle 开关
      - api: [`/set-rgb-matrix-enable`](#post-set-rgb-matrix-enable)
    - RGB点阵样式
      - peripheral: rgb_matrix
      - 下拉框选择：
        - solid
        - breathing
        - rainbow
        - rainbow_reverse
        - spin
        - dual_spin
        - rainbow_spin
        - shift_spin
      - api: [`/set-rgb-matrix-style`](#post-set-rgb-matrix-style)
    - RGB点阵颜色
      - 颜色选择器
      - api: [`/set-rgb-matrix-color`](#post-set-rgb-matrix-color)
    - RGB点阵颜色2
      - 颜色选择器
      - 只有在dual_spin模式下会显示
      - api: [`/set-rgb-matrix-color2`](#post-set-rgb-matrix-color2)
    - RGB点阵速度
      - 滑动条
      - 最小值1
      - 最大值100
      - 在solid模式下不显示
      - api: [`/set-rgb-matrix-speed`](#post-set-rgb-matrix-speed)
    - RGB点阵亮度
      - 滑动条
      - 最小值1
      - 最大值100
      - 在breathing 模式下不显示
      - api: [`/set-rgb-matrix-brightness`](#post-set-rgb-matrix-brightness)
  - OLED分类
    - peripheral: oled
    - OLED 开关
      - key: oled_enable
      - toggle 开关
      - api: [`/set-oled-enable`](#post-set-oled-enable)
    - OLED 旋转
      - key: oled_rotation
      - button group: 0, 180
      - api: [`/set-oled-rotation`](#post-set-oled-rotation)
    - OLED 页面
      - key: oled_pages
      - 弹窗编辑
        - 从peripheral获取可用页面， oled_pages开头的都是页面
        - 列表列出所有可用页面
        - 每一项可以打勾开关，表示是否显示，取消勾后显示浅灰色，自动弹到下方
        - 每一项可以拖动切换位置
        - 点击保存按钮，发送api[`/set-oled-pages`](#post-set-oled-pages)
        - 点击取消按钮，关闭弹窗
  - 邮件设置分类
    - peripheral: send_email
    - 在什么时候发送邮件
      - 标题: Send email on
      - 描述: Select events that trigger emails
      - key: send_email_on
      - 弹窗选择开关
        - 固定列表
          - battery_activated
          - low_battery
          - power_disconnected
          - power_restored
          - power_insufficient
          - battery_critical_shutdown
          - battery_voltage_critical_shutdown
        - 每一项都是toggle 开关
        - 排序无关
        - 点击保存按钮，发送api[`/set-send-email-on`](#post-set-send-email-on)
        - 点击取消按钮，关闭弹窗
    - 接收邮件邮箱
      - 标题: Send email to
      - 描述: Email address to send emails to
      - key: send_email_to
      - 邮箱输入框
      - api: [`/set-send-email-to`](#post-set-send-email-to)
    - SMTP服务器
      - 标题: SMTP Server
      - 描述: SMTP server address
      - key: smtp_server
      - 输入框: http/https选项（默认https），地址输入框，冒号，端口号，使用TLS选项（http时显示）
      - 地址api: [`/set-smtp-server`](#post-set-smtp-server)
      - 端口api: [`/set-smtp-port`](#post-set-smtp-port)
      - 使用TLS api: [`/set-smtp-security`](#post-set-smtp-security)
    - SMTP账号
      - 标题: SMTP Account
      - 描述: SMTP account email address
      - key: smtp_email
      - 输入框
      - api: [`/set-smtp-email`](#post-set-smtp-email)
    - SMTP密码
      - 标题: SMTP Password
      - 描述: SMTP account password
      - key: smtp_password
      - 输入框
      - api: [`/set-smtp-password`](#post-set-smtp-password)
    - 测试SMTP
      - 标题: Test SMTP
      - 描述: Test SMTP settings
      - key: smtp_test
      - button
      - api: [`/test-smtp`](#get-test-smtp)

## Peripherals

```python
PERIPHERALS = [
    "storage",
    "cpu",
    "network",
    "memory",
    "history",
    "log",

    "input_voltage",
    "input_current",
    "output_switch",
    "output_voltage",
    "output_current",
    "battery_voltage",
    "battery_current",
    "battery_capacity",
    "battery_percentage",
    "power_source",
    "is_input_plugged_in",
    "is_battery_plugged_in",
    "is_charging",
    "power-failure-simulation",

    "spc_fan_power",
    "pwm_fan_speed",
    "gpio_fan_state",
    "gpio_fan_mode",
    "oled_disk",
    "oled_ip",
    "oled_sleep",
    "rgb_matrix",

    "shutdown_percentage",
    "power_off_percentage",

    "timezone",
    "auto_time_enable",
    "time",
    "sta_switch",
    "sta_ssid_scan",
    "sta_ssid",
    "sta_psk",
    "ap_ssid",
    "ap_psk",
    "ota_auto",
    "ota_manual",
    "mac_address",
    "ip_address",
    "sd_card_usage",
    "download_history_file",
    "default_on",
    "restart",
    "temperature_unit",
    "cpu_temperature",
    "gpu_temperature",
]
```
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
23. gpio_fan_mode: GPIO风扇模式（int）
24. oled: OLED显示磁盘容量的磁盘路径
25. shutdown_percentage: 关机百分比
26. power_off_percentage: 断电百分比
27. timezone: 时区
28. auto_time_enable: 自动时间开关
29. time: 时间
30. sta_switch: wifi 开关
31. sta_ssid_scan: Wi-Fi账号可搜索
32. sta_ssid: Wi-Fi账号
33. sta_psk: Wi-Fi密码
34. ap_ssid: AP账号
35. ap_psk: AP密码
36. ota_auto: 自动升级
37. ota_manual: 手动升级
38. mac_address: Mac地址
39. ip_address: IP地址
40. sd_card_usage: SD卡容量占用
41. download_history_file: 下载历史数据文件
42. default_on: 是否默认开机的选项
43. restart: 设备自己是否支持重启
44. cpu_temperature: CPU温度
45. gpu_temperature: GPU温度
46. temperature_unit: 温度单位

## Config

```JSON
{
    "system": {
        "rgb_color": "#0a1aff",
        "rgb_brightness": 50,
        "rgb_style": "breathing",
        "rgb_speed": 50,
        "rgb_enable": true,
        "rgb_led_count": 4,
        "temperature_unit": "C",
        "gpio_fan_mode": 2,
        "gpio_fan_pin": 6,
        "oled_disk": "total",
        "oled_network_interface": "all"
    }
}
```


## API

api地址: `http://ip:34001/api/v1.0`

### GET /get-version

获取当前版本号

- Response: 
  - `{"status": true, "data": "1.0.0"}`

### GET /get-device-info

获取设备信息

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

测试服务状态

- Response: 
  - `{"status": true, "data": "OK"}`

### GET /test-mqtt

测试MQTT连接

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

### GET /get-data

获取数据

- Data:
  - `n` - 获取最新的多少个数据，默认是1
- Response:
  - `{"status": true, "data": []}`

### GET /get-history DEPRECATED

获取历史数据

- Data:
  - `n` - Number of records to return
- Response:
  - `{"status": true, "data": []}`

### GET /get-history-file

获取历史数据文件

- Data:
  - `date` - Date in format `YYYY-MM-DD`
- Response:
  - file

### GET /get-time-range

获取时间范围
 
- Data:
  - `start` - Start time
  - `end` - End time
  - `key`(optional) - Key to filter
- Response:
  - `{"status": true, "data": []}`

### GET /get-config

获取所有设置

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

### GET /get-log-list

获取日志列表

- Response:
  - `{"status": true, "data": []}`

### GET /get-log

获取日志

- Data:
  - `filename` - Log file name
  - `lines`(optional) - Number of records to return
  - `filter`(optional) - Filter, divided by comma
  - `level`(optional) - Log level `['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']`
- Response:
  - `{"status": false, "error": "[ERROR] file not found"}`
  - `{"status": true, "data": []}`

### GET /get-wifi-config

获取Wi-Fi配置

- Response:
  - `{"status": true, "data": {"sta_switch": true, "sta_ssid": "SSID","sta_psk": "password"}}`

### GET /get-wifi-state

- Description: Get Wi-Fi state
- Response:
  - `{"status": true, "data": "connected"}`
  - `{"status": true, "data": "disconnected"}`
  - `{"status": true, "data": "connecting"}`

### GET /get-wifi-scan

获取Wi-Fi扫描列表

- Response:
  - `{"status": true, "data": [{rssi：-39, ssid：'SSID1', bssid：'F6:96:34:88:EF:DC', channel：6, secure：3}]}`  

### GET /get-wifi-status

获取Wi-Fi状态

- Response:
  - `{"status": true, "data": "0"}` IDLE_STATUS
  - `{"status": true, "data": "1"}` NO_SSID_AVAIL
  - `{"status": true, "data": "2"}` SCAN_COMPLETED
  - `{"status": true, "data": "3"}` CONNECTED
  - `{"status": true, "data": "4"}` CONNECT_FAILED
  - `{"status": true, "data": "5"}` CONNECTION_LOST
  - `{"status": true, "data": "6"}` DISCONNECTED

### GET /get-wifi-ip

获取Wi-Fi IP

- Response:
  - `{"status": true, "data": "192.168.1.1"}`

### GET /get-ap-config

获取AP配置

- Response:
  - `{"status": true, "data": {"ap_ssid": "SSID", "ap_psk": "password"}}`

### GET /get-timestamp

获取当前时间戳

- Response:
  - `{"status": true, "data": "1612137600"}`

### GET /get-default-on

获取是否默认开机

- Response:
  - `{"status": true, "data": "true"}`

### GET /get-output

获取输出状态

- Response:
  - `{"status": true, "data": 0}` -  0/1/2: Power off 断电/Shutdown 关机/Power on 开机

### GET /get-disk-list

获取磁盘列表

- Response:
  - `{"status": true, "data": ["sda1", "nvme0", 'mmblk0']}`

### GET /get-network-interface-list

获取网络接口列表

- Response:
  - `{"status": true, "data": ["eth0", "wlan0"]}`

### POST /clear-history

清除历史数据

- Response:
  - `{"status": true, "data": "OK"}`

### POST /delete-log-file

删除日志文件

- Data:
  - `filename` - Log file name
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-config DEPRECATED

- Description: Set configuration
- Data:
  - `data` - Configuration data
- Response:
  - `{"status": true, "data": data}`

### POST /set-temperature-unit

设置温度单位

- Data:
  - `unit` - 单位 C/F
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-output

设置输出

- Data:
  - `switch` - Output switch 0/1/2: Power off 断电/Shutdown 关机/Power on 开机

- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-wifi-config

Wi-Fi配置
- Data:
  - `sta_switch` - Wi-Fi switch 0/1
  - `sta_ssid` - Wi-Fi SSID
  - `sta_psk` - Wi-Fi password
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-sta-switch

Wi-Fi STA模式配置
- Data:
  - `sta_switch` - Wi-Fi switch 0/1
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-wifi-restart

重启Wi-Fi

- Response:　没有返回

### POST /set-ap-config

AP配置

- Data:
  - `ap_ssid` - AP SSID
  - `ap_psk` - AP password
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-ap-restart

重启AP

- Response:　没有返回

### POST /ota-update

OTA 更新

- Data:
  - `file` - OTA file
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-shutdown-percentage

设置关机电池百分比

- Data:
  - `shutdown-percentage` - 百分比
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-power-off-percentage

设置断电电池百分比

- Data:
  - `power-off-percentage` - 百分比
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-auto-time

设置自动时间

- Data:
  - `enable` - 自动时间开关 true/false
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-timestamp

设置时间

- Data:
  - `timestamp` - 时间戳（秒）
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-timezone

设置时区

- Data:
  - `timezone` - 时区
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-ntp-server

设置NTP服务器

- Data:
  - `ntp_server` - NTP服务器
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-restart

重启设备

- Response:　没有返回

### POST /set-fan-led

设置风扇LED开关

- Data:
  - `led` - LED开关 on/off/follow
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-fan-power

设置风扇功率

- Data:
  - `fan_power` - 风扇功率
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-fan-mode

设置风扇模式

- Data:
  - `fan_mode` - 风扇模式 0/1/2/3/4 Always On/Performance/Cool/Balanced/Quiet
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-sd-data-interval

设置SD卡数据间隔

- Data:
  - `data_interval` - 数据间隔，单位秒
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-sd-data-retain

设置SD卡数据保留天数

- Data:
  - `data_retain` - 数据保留天数，单位天
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-brightness

设置RGB灯亮度

- Data:
  - `brightness` - 亮度，0-100
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-color

设置RGB灯颜色

- Data:
  - `color` - 颜色，格式为#RRGGBB
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-enable

设置RGB灯开关

- Data:
  - `enable` - 开关，true/false
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-led-count

设置RGB灯数量

- Data:
  - `led_count` - 灯数量
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-speed

设置RGB灯速度

- Data:
  - `speed` - 速度，0-100
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-style

设置RGB灯样式

- Data:
  - `style` - 样式，'solid', 'breathing', 'flow', 'flow_reverse', 'rainbow', 'rainbow_reverse', 'hue_cycle'
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-matrix-enable

设置RGB灯矩阵开关

- Data:
  - `enable` - 开关，true/false
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-matrix-style

设置RGB灯矩阵样式

- Data:
  - `style` - 样式，['solid', 'breathing', 'rainbow', 'rainbow_reverse', 'spin', 'dual_spin', 'rainbow_spin', 'shift_spin']
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-matrix-color

设置RGB灯矩阵颜色

- Data:
  - `color` - 颜色，格式为#RRGGBB
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-matrix-color2

设置RGB灯矩阵第二个颜色

- Data:
  - `color` - 颜色，格式为#RRGGBB
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-matrix-brightness

设置RGB灯矩阵亮度

- Data:
  - `brightness` - 亮度，0-100
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-rgb-matrix-speed

设置RGB灯矩阵动画速度

- Data:
  - `speed` - 速度，0-100
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-oled-sleep-timeout

设置 OLED 休眠超时时间

- Data:
  - `timeout` - 超时时间，单位秒
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-oled-enable

设置OLED显示开关

- Data:
  - `enable` - 开关，true/false
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-oled-disk

设置OLED显示磁盘容量的磁盘路径

- Data:
  - `disk` - 磁盘路径 'total', 或者是磁盘路径
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-oled-network-interface

设置OLED显示网络接口

- Data:
  - `interface` - 网卡名称， 'all', 或者是网络接口名称
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-oled-rotation

设置OLED显示方向

- Data:
  - `rotation` - 方向 0/180
- Response:
  - `{"status": true, "data": "OK"}`
  - `{"status": false, "error": "[ERROR] rotation {rotation} not found, available values: 0 or 180"}`

### POST /set-oled-pages
设置 OLED的页面

- Data:
  - `pages` - 页面列表
- Response:
  - `{"status": true, "data": "OK"}`
  - `{"status": false, "error": "[ERROR] page {page} not found, available values: {available_pages}"}`

### POST /set-send-email-on

设置在什么事件需要发送邮件

- Data:
  - `on` - 发送邮件的事件， ["battery_activated", "low_battery", "power_disconnected", "power_restored", "power_insufficient", "battery_critical_shutdown", "battery_voltage_critical_shutdown"]
- Response:
  - `{"status": true, "data": "OK"}`
  - `{"status": false, "error": "[ERROR] on {on} not found, available values: ["battery_activated", "low_battery", "power_disconnected", "power_restored", "power_insufficient", "battery_critical_shutdown", "battery_voltage_critical_shutdown"]"}`

### POST /set-send-email-to

设置接受提醒邮件的邮箱

- Data:
  - `to` - 邮箱地址
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-smtp-server

设置SMTP服务器

- Data:
  - `server` - SMTP服务器地址
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-smtp-port

设置SMTP端口

- Data:
  - `port` - SMTP端口
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-smtp-email

设置SMTP邮箱

- Data:
  - `email` - SMTP邮箱
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-smtp-password

设置SMTP密码

- Data:
  - `password` - SMTP密码
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-smtp-security

设置SMTP是否使用TLS

- Data:
  - `security` - SMTP的加密方式， 'none', 'ssl' or 'tls'
- Response:
  - `{"status": true, "data": "OK"}`
  - `{"status": false, "error": "[ERROR] security {security} not found, available values: 'none', 'ssl' or 'tls'"}`

### GET /test-smtp

测试SMTP设置

- Response:
  - `{"status": true, "data": "OK"}`
  - `{"status": false, "error": "[ERROR] {error}"}`

### POST /start-ups-power-failure-simulation

电池测试

- Data:
  -`time` - 测试时间，单位秒
-Response:
  - `{"status": true, "data": "OK"}`


### GET /get-ups-power-failure-simulation

获取电池测试结果

- Response:
  - `{"status": true, "data": {}}`
JSON数据格式如下：
```json
   {
    "available_bat_capacity": 1040.0,
    "available_time": 8747,
    "available_time_str": "2hour 25 min 47 sec",
    "bat_current_avg": 0.428,
    "bat_current_max": 0.696,
    "bat_power_avg": 3.446,
    "bat_power_max": 5.539,
    "bat_voltage_avg": 8.056,
    "bat_voltage_max": 8.106,
    "battery_percentage": 93,
    "output_current_avg": 0.573,
    "output_current_max": 0.956,
    "output_power_avg": 3.011,
    "output_power_max": 5.04,
    "output_voltage_avg": 5.258,
    "output_voltage_max": 5.278,
    "shutdown_percentage": 28
    }
```

设置温度单位

- Data:
  - `unit` - 温度单位 'C' or 'F'
- Response:
  - `{"status": true, "data": "OK"}`

### GET /get-disk-list

获取磁盘列表

### POST /set-debug-level

设置调试等级

- Data:
  - `level` - 调试等级，"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"
- Response:
  - `{"status": true, "data": "OK"}`

### POST /set-restart-service

重启服务

- Data:
  - `restart` - 重启Pironman5服务，true
- Response:
  - `{"status": true, "data": "OK"}`

## Settings

### System

- Dark Mode: true/false
  - 控制UI的主题
  - 存在localstorage里面，切换页面的主题
- Show unmounted disks: true/false
  - 控制是否显示未挂载的磁盘
  - 存在localstorage里面，切换储存卡片的显示
- Show all cores: true/false
  - 控制是否显示所有的CPU核心
  - 存在localstorage里面，切换CPU卡片的显示
- Temperature unit: C/F
  - Peripheral: temperature_unit
  - API: [set-temperature-unit](#post-set-temperature-unit)
- OLED 分组
  - OLED Sleep Timeout: 0-3600s
    - 控制OLED休眠时长
    - Peripheral: oled_sleep
    - API: [set-oled-sleep_timeout](#post-set-oled-sleep-timeout)
  - OLED Enable: true/false
    - 控制OLED是否开启
    - Peripheral: oled
    - API: [set-oled-enable](#post-set-oled-enable)
  - OLED Disk: total/disk list
    - 选择OLED显示的磁盘，是哪一个。
    - Peripheral: oled
    - API: [set-oled-disk](#post-set-oled-disk)
    - API: [get-disk-list](#get-get-disk-list)
  - OLED Network Interface: all/interface name
    - 选择OLED上的IP显示，是哪一个网络接口的IP。
    - Peripheral: oled
    - API: [set-oled-network-interface](#post-set-oled-network-interface)
    - API: [get-network-interface-list](#get-get-network-interface-list)
  - OLED Rotation: 0/180
    - 选择OLED显示方向
    - Peripheral: oled
    - API: [set-oled-rotation](#post-set-oled-rotation)
  - OLED Pages: page list
    - 选择OLED显示的页面
    - Peripheral: oled
    - API: [set-oled-pages](#post-set-oled-pages)
- Fan分组
  - Fan LED: on/off/follow
    - Peripheral: gpio_fan_led
    - API: [set-fan-led](#post-set-fan-led)
  - Fan Power: 0-100
    - Peripheral: spc_fan_power
    - API: [set-fan-power](#post-set-fan-power)
  - Fan Mode: 0/1/2/3/4 Always On/Performance/Cool/Balanced/Quiet
    - Peripheral: gpio_fan_mode
    - API: [set-fan-mode](#post-set-fan-mode)
- RGB 分组
  - RGB Enable: true/false
    - Peripheral: ws2812
    - API: [set-rgb-enable](#post-set-rgb-enable)
  - RGB LED Count: 1-4
    - Peripheral: ws2812
    - API: [set-rgb-led-count](#post-set-rgb-led-count)
  - RGB Color: #RRGGBB
    - Peripheral: ws2812
    - API: [set-rgb-color](#post-set-rgb-color)
  - RGB Speed: 0-100
    - Peripheral: ws2812
    - API: [set-rgb-speed](#post-set-rgb-speed)
  - RGB Style: solid/breathing/flow/flow_reverse/rainbow/rainbow_reverse/hue_cycle
    - Peripheral: ws2812
    - API: [set-rgb-style](#post-set-rgb-style)
- RGB Matrix 分组
  - RGB Matrix Enable: true/false
    - Peripheral: rgb_matrix
    - API: [set-rgb-matrix-enable](#post-set-rgb-matrix-enable)
  - RGB Matrix Style: solid/breathing/rainbow/rainbow_reverse/spin/dual_spin/rainbow_spin/shift_spin
    - Peripheral: rgb_matrix
    - API: [set-rgb-matrix-style](#post-set-rgb-matrix-style)
  - RGB Matrix Color: #RRGGBB
    - Peripheral: rgb_matrix
    - API: [set-rgb-matrix-color](#post-set-rgb-matrix-color)
  - RGB Matrix Color2: #RRGGBB
    - Peripheral: rgb_matrix
    - 其他条件：
      - 只有在style为dual_spin时，才会生效
    - API: [set-rgb-matrix-color2](#post-set-rgb-matrix-color2)
  - RGB Matrix Brightness: 0-100
    - Peripheral: rgb_matrix
    - 其他条件：
      - 模式是breathing时隐藏
    - API: [set-rgb-matrix-brightness](#post-set-rgb-matrix-brightness)
  - RGB Matrix Speed: 0-100
    - Peripheral: rgb_matrix
    - 其他条件：
      - 模式是solid时隐藏
    - API: [set-rgb-matrix-speed](#post-set-rgb-matrix-speed)
- SD卡分组
  - SD Card Data Interval: 60-3600
    - Peripheral: sd_card_usage
    - API: [set-sd-data-interval](#post-set-sd-data-interval)
  - SD Card Data Retain: 1-7
    - Peripheral: sd_card_usage
    - API: [set-sd-data-retain](#post-set-sd-data-retain)
  - SD Card Usage:
    - Peripheral: sd_card_usage
    - API: [get-sd-usage](#get-sd-usage)
- Shutdown Percentage: 0-100
  - Peripheral: shutdown_percentage
  - API: [set-shutdown-percentage](#post-set-shutdown-percentage)
- Mac Address
  - Peripheral: mac_address
- IP Address
  - Peripheral: ip_address
- Clear History 清除历史及数据
  - Peripheral: clear_history
  - API: [clear-history](#post-clear-history)
  - 弹窗警告确认： Are you sure to clear history and data? All histories and data will be lost. And this action cannot be undone.
- Restart Service
  - Peripheral: restart_service
  - API: [set-restart-service](#post-set-restart-service)
  - 弹窗警告确认： Are you sure to restart Pironman5 service?