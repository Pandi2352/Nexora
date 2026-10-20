import { useEffect, useState, type FormEvent } from 'react'
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
      setName(initialUnit.name || '')
      setCode(initialUnit.code || '')
      setDescription(initialUnit.description || '')
      setIsActive(initialUnit.isActive ?? true)
      setIsDefault(initialUnit.isDefault ?? false)
    } else {
      setName('')
      setCode('')
      setDescription('')
      setIsActive(true)
      setIsDefault(false)
    }
    setError(null)
  }, [initialUnit, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Business unit name is required')
      return
    }
    if (!code.trim()) {
      setError('Short code is required')
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
      title={initialUnit ? 'Edit Business Unit' : 'Add Business Unit'}
      description="Define operating business divisions for lead assignment and sales reporting."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" form="business-unit-form" type="submit" loading={isSubmitting}>
            {initialUnit ? 'Save Changes' : 'Create Unit'}
          </Button>
        </div>
      }
    >
      <form id="business-unit-form" onSubmit={handleSubmit} className="space-y-4 py-2">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            hint="Full organizational division title"
            required
            autoFocus
          />
          <Input
            label="Short Code"
            placeholder="e.g. ENT"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            hint="Unique 2-5 letter code"
            required
          />
        </div>

        <Textarea
          label="Operational Scope"
          rows={3}
          placeholder="Brief summary of division responsibilities, target market, or offerings..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          hint="Summary for lead pipeline routing"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start gap-3 p-3 rounded-md border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-0.5 size-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-slate-800">Active Division</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Enable this unit for new leads and deals
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-md border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mt-0.5 size-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-slate-800">Primary Default</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Default fallback assignment unit
              </span>
            </div>
          </label>
        </div>
      </form>
    </Modal>
  )
}
