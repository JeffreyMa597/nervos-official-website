import clsx from 'clsx'
import { FC, ReactNode, useState } from 'react'
import { Description, DescriptionType } from './Description'
import { Functions, FunctionsType } from './Functions'
import { Header, HeaderType } from './Header'
import { Info, InfoType } from './Info'
import { Resources, ResourcesType } from './Resources'
import { Positions, PositionsType } from './Positions'
import { TableOfContents } from './TableOfContents'
import { ContributorsDialog } from './ContributorsDialog'
import { FunctionsItemType } from './FunctionsItem'

import styles from './index.module.scss'
import { Supports } from './Supports'
import { TOCContextProvider } from '../TableOfContents'

export type BaseSeparatePageType = HeaderType &
  DescriptionType &
  Partial<PositionsType> &
  Partial<InfoType> &
  FunctionsType &
  Partial<ResourcesType> & {
    functionsExtensionTitle?: {
      extensionTitle: string | ReactNode
      extensionTitleFunctions: FunctionsItemType[]
    }
    editLink?: string
    isProgressBar?: boolean
    isNeedSupports?: boolean
    headerClassName?: string
    descriptionClassName?: string
    infoClassName?: string
    functionsClassName?: string
    functionsTitleClassName?: string
    extensionTitleFunctionsClassName?: string
    embellishedElements?: {
      content: ReactNode
      top?: number
      right?: number
      left?: number
    }[]
  }

export const BaseSeparatePage: FC<BaseSeparatePageType> = props => {
  const {
    className,
    headerClassName,
    descriptionClassName,
    infoClassName,
    functionsClassName,
    functionsTitleClassName,
    extensionTitleFunctionsClassName,
    embellishedElements,
    title,
    floatIcons,
    description,
    positionsData,
    info,
    editor,
    functions,
    functionsExtensionTitle,
    editLink,
    isProgressBar = true,
    isNeedSupports = false,
    resourceData,
    ...rest
  } = props

  const FunctionsContainer = ({
    functions,
    isProgressBar,
    className,
  }: {
    functions: FunctionsItemType[]
    isProgressBar?: boolean
    className?: string
  }) => (
    <div className={styles.functionsWrap}>
      <Functions isProgressBar={isProgressBar} functions={functions} className={className} />
      {/* Todo: progressbar need complete later*/}
      {isProgressBar ? <TableOfContents className={clsx(styles.tableOfContents)} editLink={editLink} /> : null}
    </div>
  )

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleContributorDialogClose = () => setIsOpen(false)

  return (
    <TOCContextProvider>
      <div className={clsx(styles.baseSeparatePage, className)} {...rest}>
        <div className={styles.embellishedElements}>
          {embellishedElements?.map((embellishedElement, idx) => (
            <div
              key={idx}
              className={clsx(styles.embellishedElement)}
              style={{
                top: embellishedElement.top,
                right: embellishedElement.right,
                left: embellishedElement.left,
              }}
            >
              {embellishedElement.content}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          <Header className={clsx(styles.headerClassName, headerClassName)} title={title} floatIcons={floatIcons} />
          <div className={styles.descriptionWrap}>
            <Description className={descriptionClassName} description={description} />
          </div>

          {positionsData ? (
            <div className={styles.positionsWrap}>
              <Positions positionsData={positionsData} />
            </div>
          ) : null}
          {info ? (
            <div className={styles.infoWrap}>
              <Info
                className={infoClassName}
                info={info}
                editor={editor}
                editLink={editLink}
                onContributorsButtonClick={() => setIsOpen(true)}
              />
            </div>
          ) : null}

          {functionsExtensionTitle?.extensionTitle ? (
            <div className={clsx(styles.functionsTitleWrap, functionsTitleClassName)}>
              {functionsExtensionTitle.extensionTitle}
            </div>
          ) : null}

          {functionsExtensionTitle?.extensionTitleFunctions ? (
            <FunctionsContainer
              functions={functionsExtensionTitle.extensionTitleFunctions}
              isProgressBar={isProgressBar}
              className={extensionTitleFunctionsClassName}
            />
          ) : null}
          {isNeedSupports ? (
            <div className={clsx(styles.supportsWrap)}>
              <Supports />
            </div>
          ) : null}

          <FunctionsContainer functions={functions} isProgressBar={isProgressBar} className={functionsClassName} />

          {resourceData ? (
            <div className={styles.resourcesWrap}>
              <Resources resourceData={resourceData} />
            </div>
          ) : null}

          <ContributorsDialog editor={editor!} status={isOpen} onClose={handleContributorDialogClose} />
        </div>
      </div>
    </TOCContextProvider>
  )
}
