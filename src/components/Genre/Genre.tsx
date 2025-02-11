import { Tag } from 'antd';
import variables from '@styles/modules/_variables.module.scss';
import './Genre.scss';

type Props = { children: string };

export default function Genre({ children }: Props) {
  return <Tag style={{ color: variables.colorText }}>{children}</Tag>;
}
