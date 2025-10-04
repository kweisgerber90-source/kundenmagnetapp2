// Type declarations for UI components
declare module '@/components/ui/textarea' {
  export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
  export const Textarea: React.ForwardRefExoticComponent<
    TextareaProps & React.RefAttributes<HTMLTextAreaElement>
  >
}

declare module '@/components/ui/label' {
  export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
  export const Label: React.ForwardRefExoticComponent<
    LabelProps & React.RefAttributes<HTMLLabelElement>
  >
}
