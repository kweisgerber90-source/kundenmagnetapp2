// hooks/use-toast.ts (oder hooks/use-toast.tsx)

export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title: string
      description?: string
      variant?: 'default' | 'destructive'
    }) => {
      // Einfache Browser-Alert als Fallback
      if (variant === 'destructive') {
        alert(`❌ ${title}\n${description || ''}`)
      } else {
        alert(`✅ ${title}\n${description || ''}`)
      }
    },
  }
}
