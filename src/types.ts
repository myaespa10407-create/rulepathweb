export type FieldName = 'major' | 'cohort' | 'track' | 'semester' | 'level' | 'year';

export type FormValues = Record<FieldName, string>;

export interface Option {
  value: string;
  label: string;
}