import { t } from '@/lib/i18n'

export default function ResourceLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-stone-500">
      <p>{t('loading')}</p>
    </div>
  )
}
