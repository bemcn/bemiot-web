export interface ProductClass {
  classId: number;
  className: string;
  levelId: number;
  classRoute: string;
  classRouteName: string;
  orderNum: number;
  remark: string;
}

export interface ProductClassTable {
  classId: number;
  className: string;
  levelId: number;
  remark: string;
  orderNum: number;
  children: ProductClassTable[] | null;
}

export interface ProductClassTree {
  id: number;
  label: string;
  children: ProductClassTree[] | null;
}
