export const LAST_UPDATED_FN =
  '=IF(COUNTA($A$1:$G$1)=0,"",iferror($A$1:$G$1+"x",today()))';
