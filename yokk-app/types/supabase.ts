// Stub for Supabase types
export interface Database {
  public: {
    Tables: any
    Views: any
    Functions: any
    Enums: any
  }
}

export type Tables = Database['public']['Tables']
export type Rows<T extends keyof Tables> = Tables[T]['Row']