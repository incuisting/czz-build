import type { FC } from 'react';
import { useState } from 'react';
import { Button} from 'antd';
import { useSelections, useInterval, useMount } from 'ahooks';
import { useDatabase, usePillarControl, useSetting } from '@/hooks';
import BaseModal from './BaseModal';
import ControlCard from './ControlCard';
import styles from './index.less';

const Home: FC = () => {
  const { pillar } = useDatabase();
  const { checkLic } = useSetting();
  const { up, down, updateAllStatus } = usePillarControl<number>();
  const [czzList, setCzz] = useState<Models.Pillar[]>([]);
  const [pillarDetail, setPillarDetail] = useState<Models.Pillar | null>(null);
  const [selections, setSelections] = useState<number[]>([]);
  const { selected, allSelected, isSelected, toggle, toggleAll, unSelectAll } =
    useSelections(selections, []);
  const [modalVisible, setModalVisible] = useState(false);
  async function queryDB() {
    const devices = await pillar.finAll();
    setCzz(devices);
    setSelections(devices.map((el: { id: number }) => el.id));
  }

  useMount(() => {
    queryDB();
    checkLic();
  });
  useInterval(() => {
    updateAllStatus();
    queryDB();
  }, 1000);

  const addDevice = (values: { name: string; ip: string; port: string }) => {
    const { name, ip, port } = values;
    pillar.insert(ip, name, port);
    setModalVisible(false);
    queryDB();
  };
  const updateDevice = (
    id: number,
    values: { name: string; ip: string; port: string },
  ) => {
    const { name, ip, port } = values;
    pillar.update(id, { name, ip, port });
    setModalVisible(false);
    queryDB();
  };
  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <div className={styles.operator}>
          <Button
            onClick={() => {
              toggleAll();
            }}
            type={'primary'}
          >
            {allSelected ? '取消' : '全选'}
          </Button>
          <Button
            disabled={!(selected.length > 0)}
            onClick={() => {
              up(selected);
              unSelectAll();
              queryDB();
            }}
            type={'default'}
          >
            升起
          </Button>
          <Button
            disabled={!(selected.length > 0)}
            onClick={() => {
              down(selected);
              unSelectAll();
              queryDB();
            }}
            type={'default'}
          >
            降下
          </Button>
        </div>
        <div className={styles.deviceManage}>
          <Button
            disabled={!(selected.length > 0)}
            onClick={() => {
              console.log('del');
              pillar.delete(selected);
              unSelectAll();
              queryDB();
            }}
            danger
          >
            删除设备
          </Button>
          <Button
            onClick={() => {
              setModalVisible(true);
              setPillarDetail(null);
            }}
          >
            添加设备
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        {czzList.map((el) => {

          return (
            <ControlCard
              key={el.id}
              name={el.name}
              handleSetting={async () => {
                const item = await pillar.findByIds([el.id]);
                setPillarDetail(item[0]);
                setModalVisible(true);
              }}
              handleSwitch={(value: boolean) => {
                if (value) {
                  up([el.id]);
                } else {
                  down([el.id]);
                }
              }}
              status={el.status}
              selected={isSelected(el.id)}
              handleSelected={() => toggle(el.id)}
            ></ControlCard>
          );
        })}
      </div>
      <BaseModal
        title={pillarDetail ? '编辑' : '添加'}
        visible={modalVisible}
        handleOk={(values) => {
          if (pillarDetail) {
            const { id } = pillarDetail;
            updateDevice(id, values);
          } else {
            addDevice(values);
          }
        }}
        handleCancel={() => {
          setModalVisible(false);
          setPillarDetail(null);
        }}
        initData={pillarDetail}
      ></BaseModal>
    </div>
  );
};

export default Home;
