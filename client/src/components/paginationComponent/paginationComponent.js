import React from 'react'
import { Pagination } from 'antd';

const PaginationComponent = ({handleChangePage, totalProduct}) => {
  // const onShowSizeChange = (current, pageSize) => {
  //   console.log(current, pageSize);
  // };
  return (
    <Pagination defaultCurrent={1} total={totalProduct} pageSize={5}  onChange={handleChangePage} />
  )
}

export default PaginationComponent