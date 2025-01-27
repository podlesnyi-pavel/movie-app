import { TOnChangeCurrentPageFunc } from '~types/TOnChangeCurrentPageFunc';
import './AppPagination.scss';
import { Pagination } from 'antd';

interface PropsAppPagination {
  page?: number | undefined;
  total?: number | undefined;
  onChangeCurrentPage: TOnChangeCurrentPageFunc;
  className: string;
}

export default function AppPagination({
  page,
  total,
  onChangeCurrentPage,
  className,
}: PropsAppPagination) {
  return (
    <Pagination
      defaultCurrent={1}
      current={page}
      total={total}
      showSizeChanger={false}
      disabled={total === 1}
      onChange={(page) => onChangeCurrentPage(page)}
      className={className}
    />
  );
}
