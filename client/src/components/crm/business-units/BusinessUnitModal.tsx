import { useEffect, useState } from 'react'
import { Button, Input, Modal, Textarea } from '@/components/ui'
import type { BusinessUnitItem, CreateBusinessUnitPayload } from '@/types/crm'

interface BusinessUnitModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: CreateBusinessUnitPayload) => Promise<void>
  initialUnit?: BusinessUnitItem | null
}

export function BusinessUnitModal({
  isOpen,
  onClose,
  onSave,
  initialUnit,
}: BusinessUnitModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isDefault, setIsDefault] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialUnit) {
      setName(initialUnit.name)
      setCode(initialUnit.code)
      setDescription(initialUnit.description || '')
      setIsActive(initialUnit.isActive)
      setIsDefault(initialUnit.isDefault)
    } else {
      setName('')
      setCode('')
      setDescription('')
      setIsActive(true)
      setIsDefault(false)
    }
    setError(null)
  }, [initialUnit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Business unit name is required')
      return
    }
    if (!code.trim()) {
      setError('Business unit code is required')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSave({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        isActive,
        isDefault,
      })
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save business unit.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialUnit ? 'Edit Business Unit' : 'Create Business Unit'}
      description="Define operating business divisions for lead assignment and sales reporting."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Unit Name"
            placeholder="e.g. Enterprise Solutions"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!initialUnit && !code) {
                setCode(e.target.value.slice(0, 3).toUpperCase())
              }
            }}
            required
          />
          <Input
            label="Short Code"
            placeholder="e.g. ENT"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        <Textarea
          label="Description"
          rows={2}
          placeholder="e.g. Enterprise and global corporate accounts..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-between rounded-md border border-slate-200 p-3 bg-slate-50/50">
          <div>
            <p className="text-xs font-medium text-slate-900">Active Status</p>
            <p className="text-[11px] text-slate-500">Enable this unit for new leads and opportunities</p>
          </div>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialUnit ? 'Update Unit' : 'Create Unit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
