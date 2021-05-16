import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { Switch } from 'antd';
import classnames from 'classnames';
import styles from './card.less';
import { SettingOutlined } from '@ant-design/icons';

type Props = {
  handleSwitch: (value: boolean) => void;
  handleSetting: () => void;
  name: string;
  status: number;
  selected: boolean;
  handleSelected: () => void;
};
const ControlCard: FC<Props> = React.memo((props) => {
  const {
    name,
    status,
    handleSwitch,
    selected,
    handleSelected,
    handleSetting,
  } = props;
  const [switchStatus, setSwitchStatus] = useState(false);
  // const isChecked = useMemo(() => {
  //   let isChecked = false;
  //   if (status === 1) {
  //     isChecked = true;
  //   }
  //   return isChecked;
  // }, [status]);
  const deviceStatus = useMemo(() => {
    let isOnline = true;
    if (status === 0) {
      isOnline = false;
    }
    return isOnline;
  }, [status]);
  useEffect(() => {
    let isChecked = status === 1;
    if (isChecked !== switchStatus) {
      setSwitchStatus(isChecked);
    }
  }, [status]);
  const handleSwitchOnChange = (value: boolean) => {
    setSwitchStatus(value);
    handleSwitch(value);
  };
  return (
    <div
      className={classnames({
        [styles.container]: true,
        [styles.selected]: selected,
      })}
      onClick={handleSelected}
    >
      {/* <div className={classnames(styles.icon)}>
        <UpOutlined />
      </div> */}
      <div
        className={classnames(styles.header)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div>{name}</div>
        <Switch
          disabled={!deviceStatus}
          checked={switchStatus}
          onChange={handleSwitchOnChange}
        ></Switch>
      </div>
      <div className={classnames(styles.body)}>
        <div className={classnames(styles.statusContent)}>
          <div
            className={classnames({
              [styles.status]: true,
              [styles.isOnline]: deviceStatus,
            })}
          ></div>
          <span>{deviceStatus ? null : '离线'}</span>
        </div>
        <div onClick={handleSetting} className={classnames(styles.setting)}>
          <SettingOutlined></SettingOutlined>
        </div>
      </div>
    </div>
  );
});

export default ControlCard;
