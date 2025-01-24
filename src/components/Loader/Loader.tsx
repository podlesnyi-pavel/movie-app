import { Flex, Spin } from 'antd';
import './Loader.scss';
import { ELoader } from './ELoader';

interface PropsLoader {
  size: ELoader;
}

export default function Loader({ size = ELoader.Default }: PropsLoader) {
  return (
    <Flex align="center" gap="middle">
      <Spin size={size} />
    </Flex>
  );
}
