import { TOnChangePageFunc } from '@/types/TOnChangePageFunc';
import './AppPagination.scss';
import { Pagination } from 'antd';

interface PropsAppPagination {
  page?: number | undefined;
  total?: number | undefined;
  onChangePage: TOnChangePageFunc;
  className: string;
}

export default function AppPagination({
  page,
  total,
  onChangePage,
  className,
}: PropsAppPagination) {
  return (
    <Pagination
      defaultCurrent={1}
      current={page}
      total={total}
      pageSize={20}
      showSizeChanger={false}
      disabled={total === 1}
      hideOnSinglePage={true}
      onChange={(page) => onChangePage(page)}
      className={className}
    />
  );
}
