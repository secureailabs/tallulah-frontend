// Next Imports
//import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Tallulah : Manage your patient data and insights',
  description: 'Tallulah is tool to help PAO and CRO teams to manage their data and insights in one place.'
}

const RootLayout = ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  // const headersList = headers()
  const direction = i18n.langDirection[params.lang]

  return (
    // <TranslationWrapper headersList={headersList} lang={params.lang}>
    <TranslationWrapper lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction}>
        <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
      </html>
    </TranslationWrapper>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export default RootLayout
