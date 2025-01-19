export interface Audition {
  [index: number]: string;
  orderNo: string;
  projectName: string;
  submittedDate: string;
  role: string;
  castingDirector: string;
  projectType: string;
  status: string;
  lastUpdated: string;
}
export interface AABrowserReq {
  audition: Audition;
}
export interface IFoundFile {
  id?: string;
  found: boolean;
}
