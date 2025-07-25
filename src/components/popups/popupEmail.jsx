import React, { useState, useEffect } from 'react';
import { Divider, Button } from '@mui/material';
import PopupFrame from './popupFrame.jsx';
import {
  SettingItemList,
  SettingItemSwitch,
  SettingItemButton,
  SettingItemText,
  SettingItemPassword,
  SettingItem,
  SMTPServer
} from './settingItems.jsx';
import DoneIcon from '@mui/icons-material/Done';

let smtEmailTimer = null;
let smtpServerTimer = null;
let smtpUserTimer = null;
let smtpPasswordTimer = null;
let smtpPortTimer = null;


const PopupEmail = (props) => {
  const [emailPopup, setEmailPopup] = useState(false);
  const [sendEmail, setSendEmail] = useState({
    // battery_activated: false,
    low_battery: false,
    power_disconnected: false,
    power_restored: false,
    power_insufficient: false,
    battery_critical_shutdown: false,
    battery_voltage_critical_shutdown: false,
  });
  const [emailError, setEmailError] = useState(false);
  const [smtpPassword, setSmtpPassword] = useState(props.config.smtp_password);
  const [testSMTPLoading, setTestSMTPLoading] = useState(false);
  const [testSMTPSuccess, setTestSMTPSuccess] = useState(false);

  useEffect(() => {
    const updatedSendEmail = { ...sendEmail };
    props.config.send_email_on.forEach((setting) => {
      if (updatedSendEmail.hasOwnProperty(setting)) {
        updatedSendEmail[setting] = true;
      }
    });
    setSendEmail(updatedSendEmail);

  }, []);

  const handleSelectTlsChange = async (value) => {
    console.log("handleSelectChange", value);
    let result = await props.sendData('set-smtp-security', { 'security': value });
    if (result === "OK") {
      props.onChange('system', 'smtp_use_tls', value);
    };
  }

  const handleAddressCalue = (value) => {
    handleSMTPServerChange(value);
  }

  const handlePortValue = (value) => {
    console.log("handlePortValue", value);
    handleSMTPPortChange(value);
  }

  const handleToggle = (setting) => {
    setSendEmail((prevState) => ({
      ...prevState,
      [setting]: !prevState[setting],
    }));
  };

  const handleEmailPopup = () => {
    setEmailPopup(!emailPopup);
  }

  const getActiveSettings = () => {
    const activeSettings = Object.entries(sendEmail)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    return activeSettings;
  };

  const handleSave = async () => {
    const sendEmailList = getActiveSettings();
    let result = await props.sendData('set-send-email-on', { 'on': sendEmailList });
    if (result === "OK") {
      props.onChange('system', 'send_email_on', sendEmailList);
    }
    handleEmailPopup();
  }
  const handleEmailChange = (value) => {
    if (value === '') {
      setEmailError(false);
      return;
    }
    if (!value.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
    if (smtEmailTimer) {
      clearTimeout(smtEmailTimer);
    };
    smtEmailTimer = setTimeout(async () => {
      let result = await props.sendData('set-send-email-to', { 'to': value });
      if (result === "OK") {
        props.onChange('system', 'send_email_to', value);
      };
      smtEmailTimer = null;
    }, 1000);
  }

  const handleSMTPServerChange = (value) => {
    if (smtpServerTimer) {
      clearTimeout(smtpServerTimer);
    };
    smtpServerTimer = setTimeout(async () => {
      console.log("set-smtp-server", value);
      let result = await props.sendData('set-smtp-server', { 'server': value });
      if (result === "OK") {
        props.onChange('system', 'smtp_server', value);
      };
      smtpServerTimer = null;
    }, 1000);
  }

  const handleSMTPUserChange = (value) => {
    if (smtpUserTimer) {
      clearTimeout(smtpUserTimer);
    };
    smtpUserTimer = setTimeout(async () => {
      let result = await props.sendData('set-smtp-email', { 'email': value });
      if (result === "OK") {
        props.onChange('system', 'smtp_email', value);
      };
      smtpUserTimer = null;
    }, 1000);
  }

  const handleSMTPPasswordChange = async (event) => {
    setSmtpPassword(event.target.value);
    if (smtpPasswordTimer) {
      clearTimeout(smtpPasswordTimer);
    };
    smtpPasswordTimer = setTimeout(async () => {
      let result = await props.sendData('set-smtp-password', { 'password': event.target.value });
      if (result === "OK") {
        props.onChange('system', 'smtp_password', event.target.value);
      };
      smtpPasswordTimer = null;
    }, 1000);
  }

  const handleSMTPPortChange = async (value) => {
    if (smtpPortTimer) {
      clearTimeout(smtpPortTimer);
    };
    smtpPortTimer = setTimeout(async () => {
      let result = await props.sendData('set-smtp-port', { 'port': Number(value) });
      if (result === "OK") {
        props.onChange('system', 'smtp_port', value);
      };
      smtpPortTimer = null;
    }, 1000);
  }

  const handleSMTPTLSChange = async (value) => {
    let result = await props.sendData('set-smtp-use-tls', { 'use_tls': value });
    if (result === "OK") {
      props.onChange('system', 'smtp_use_tls', value);
    };
  }

  const handleTestSMTP = async () => {
    setTestSMTPLoading(true);
    let result = await props.sendData('test-smtp');
    setTestSMTPLoading(false);
    if (result === "OK") {
      console.log("test-smtp OK");
      setTestSMTPSuccess(true);
      setTimeout(() => {
        setTestSMTPSuccess(false);
      }, 2000);
    };

  }

  const cleanSmtpServer = (smtpServer) => {
    return smtpServer.replace(/^https?:\/\//, '');
  };



  return (
    <>
      <SettingItemList
        primary="Send Email"
        children={
          <>
            <SettingItemButton
              title="Send email on"
              subtitle="Select events that trigger emails"
              onClick={handleEmailPopup}
            />
            <SMTPServer
              selectValue={props.config.smtp_security}
              addressCalue={cleanSmtpServer(props.config.smtp_server)}
              portValue={props.config.smtp_port}
              handleSelectChange={handleSelectTlsChange}
              handleAddressCalue={handleAddressCalue}
              handlePortValue={handlePortValue}
            />
            <SettingItemText
              title="Send email to"
              subtitle="Email address to send emails to"
              type="email"
              value={props.config.send_email_to}
              error={emailError}
              helperText={emailError ? "Please input a valid email address" : ""}
              onChange={handleEmailChange}
            />
            {/* <SettingItemText
              title="SMTP Server"
              subtitle="SMTP server address"
              value={props.config.smtp_server}
              onChange={handleSMTPServerChange}
            /> */}
            <SettingItemText
              title="SMTP Account"
              subtitle="SMTP account email address"
              type="email"
              value={props.config.smtp_email}
              onChange={handleSMTPUserChange}
            />
            {/* <SettingItemText
              title="SMTP Password"
              subtitle="SMTP account password"
              value={props.config.smtp_password}
              onChange={handleSMTPPasswordChange}
            /> */}
            <SettingItemPassword
              title="SMTP Password"
              subtitle="SMTP account password"
              value={smtpPassword}
              onChange={handleSMTPPasswordChange}
            />
            {/* <SettingItemText
              title="SMTP Port"
              subtitle="SMTP server port"
              type="number"
              value={props.config.smtp_port}
              onChange={handleSMTPPortChange}
            />
            <SettingItemSwitch
              title="Enable SMTP TLS Encryption"
              subtitle="Enable TLS (do not enable if using HTTPS)"
              onChange={handleSMTPTLSChange}
              value={props.config.smtp_use_tls} /> */}
            <SettingItemButton
              title="Test SMTP"
              subtitle=" Test SMTP settings"
              loading={testSMTPLoading}
              onClick={handleTestSMTP}
              children={
                testSMTPSuccess && <DoneIcon sx={{ color: 'green' }} />
              }
            />
            <Divider />
          </>
        }
      />
      <PopupFrame
        title="Send Email"
        onClose={handleEmailPopup}
        onConfirm={handleSave}
        open={emailPopup}
        width="40rem"
        button={true}
        cancelText="Cancel"
        confirmText="Save"
      >
        {/* <SettingItemSwitch
          title="Battery Activated"
          subtitle="on switching from external power to battery power"
          onChange={() => handleToggle('battery_activated')}
          value={sendEmail.battery_activated} /> */}
        <SettingItemSwitch
          title="Low Battery"
          subtitle="on battery level is low"
          onChange={() => handleToggle('low_battery')}
          value={sendEmail.low_battery} />
        <SettingItemSwitch
          title="Power Disconnected"
          subtitle="on external power supply is disconnected"
          onChange={() => handleToggle('power_disconnected')}
          value={sendEmail.power_disconnected} />
        <SettingItemSwitch
          title="Power Restored"
          subtitle="on external power supply is restored"
          onChange={() => handleToggle('power_restored')}
          value={sendEmail.power_restored} />
        <SettingItemSwitch
          title="Power Insufficient"
          subtitle="on the external power supply is insufficient"
          onChange={() => handleToggle('power_insufficient')}
          value={sendEmail.power_insufficient} />

        <SettingItemSwitch
          title="Battery Critical Shutdown"
          subtitle="on device shutdown due to critically low battery"
          onChange={() => handleToggle('battery_critical_shutdown')}
          value={sendEmail.battery_critical_shutdown} />

        <SettingItemSwitch
          title="Battery Voltage Critical Shutdown"
          subtitle="on device shutdown due to critically low battery voltage"
          onChange={() => handleToggle('battery_voltage_critical_shutdown')}
          value={sendEmail.battery_voltage_critical_shutdown} />
      </PopupFrame>
    </>
  )
}

export default PopupEmail;