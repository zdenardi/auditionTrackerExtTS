export const LAST_UPDATED_FN =
  '=IF(COUNTA($A$1:$G$1)=0,"",iferror($A$1:$G$1+"x",today()))';
export const PHOTO_FN = (photoURL: string) => {
  return '=IMAGE("' + photoURL + '",1)';
};

export const AUDITION_SELECT = [
  "Short",
  "Student Film",
  "Theater",
  "Film",
  "Episodic",
  "Commercial",
  "Web Series",
];
