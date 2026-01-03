import { GetFormData_Out, GetFormTemplate_Out } from '@/tallulah-ts-client'
import styles from './CardTemplates.module.css'
import Template1 from '../CardTemplateLayouts/Template1'
import Template2 from '../CardTemplateLayouts/Template2'
import Template0 from '../CardTemplateLayouts/Template0'
import Template3 from '../CardTemplateLayouts/Template3'
import Template4 from '../CardTemplateLayouts/Template4'
import Template5 from '../CardTemplateLayouts/Template5'
import Template6 from '../CardTemplateLayouts/Template6'

export interface ICardTemplates {
  templateName: TemplateNames
  data: GetFormData_Out
  formTemplate: GetFormTemplate_Out | undefined
}

export enum TemplateNames {
  TEMPLATE0 = 'Template0',
  TEMPLATE1 = 'Template1',
  TEMPLATE2 = 'Template2',
  TEMPLATE3 = 'Template3',
  TEMPLATE4 = 'Template4',
  TEMPLATE5 = 'Template5',
  TEMPLATE6 = 'Template6'
}

export interface ICard {
  data: GetFormData_Out
  formTemplate: GetFormTemplate_Out | undefined
}

const CardTemplates: React.FC<ICardTemplates> = ({ templateName, data, formTemplate }) => {
  // This is a switch statement
  switch (templateName) {
    case TemplateNames.TEMPLATE1:
      return <Template1 data={data} formTemplate={formTemplate} />
    case TemplateNames.TEMPLATE2:
      return <Template2 data={data} formTemplate={formTemplate} />
    case TemplateNames.TEMPLATE3:
      return <Template3 data={data} formTemplate={formTemplate} />
    case TemplateNames.TEMPLATE4:
      return <Template4 data={data} formTemplate={formTemplate} />
    case TemplateNames.TEMPLATE5:
      return <Template5 data={data} formTemplate={formTemplate} />
    case TemplateNames.TEMPLATE6:
      return <Template6 data={data} formTemplate={formTemplate} />
    default:
      return <Template0 data={data} formTemplate={formTemplate} />
  }
}

export default CardTemplates
