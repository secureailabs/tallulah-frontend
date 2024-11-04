'use client'

import { useEffect } from 'react'

import { OpenAPI } from '@/tallulah-ts-client'

const OpenAPIInitializer = () => {
  useEffect(() => {
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || ''
  }, [])

  return null
}

export default OpenAPIInitializer
