'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getResource } from '@/lib/store'
import { ResourceDetail } from '@/components/ResourceDetail'
import type { Resource } from '@/lib/types'

export default function ResourcePage() {
  const params = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [didNotFound, setDidNotFound] = useState(false)

  useEffect(() => {
    const id = typeof params.id === 'string' ? params.id : String(params.id)
    const r = getResource(id)
    if (r) setResource(r)
    else setDidNotFound(true)
  }, [params.id])

  if (didNotFound) notFound()
  if (!resource) return null
  return <ResourceDetail resource={resource} />
}
