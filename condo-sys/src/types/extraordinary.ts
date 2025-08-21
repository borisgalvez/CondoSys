export interface ExtraordinaryPayment {
  amount: string
  apartment: any
  apartment_data: any
  block: number
  block_data: BlockData
  category: string
  created_at: string
  created_by: any
  date: string
  description: string
  document_url: string
  id: number
}

export interface BlockData {
  id: number
  name: string
  condominium: any
}