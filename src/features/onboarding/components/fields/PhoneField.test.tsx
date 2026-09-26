import { act, fireEvent, render, screen } from '@testing-library/react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { PhoneField } from './PhoneField'

type Values = { phone_number: string }

function renderField() {
  const ref: { form?: UseFormReturn<Values> } = {}
  const Host = () => {
    const form = useForm<Values>({ defaultValues: { phone_number: '' } })
    ref.form = form
    return (
      <FormProvider {...form}>
        <PhoneField />
      </FormProvider>
    )
  }
  render(<Host />)
  return ref as { form: UseFormReturn<Values> }
}

describe('PhoneField', () => {
  it('keeps a phone restored from a saved draft after it mounted empty (resume bug)', () => {
    const { form } = renderField()
    act(() => form.reset({ phone_number: '+233241110004' }))
    expect(form.getValues('phone_number')).toBe('+233241110004')
    expect(screen.getByRole('textbox')).toHaveValue('241110004')
  })

  it('does not write to the form just by mounting', () => {
    const { form } = renderField()
    expect(form.formState.dirtyFields.phone_number).toBeUndefined()
    expect(form.getValues('phone_number')).toBe('')
  })

  it('stores country code + digits when the owner types', () => {
    const { form } = renderField()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '24 111 0004' } })
    expect(form.getValues('phone_number')).toBe('+233241110004')
    expect(screen.getByRole('textbox')).toHaveValue('24 111 0004')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })
    expect(form.getValues('phone_number')).toBe('')
  })
})
