import { useEffect, useMemo, useState } from 'react'

import { Card, Link, TablePagination, Typography } from '@mui/material'

import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { rankItem, type RankingInfo } from '@tanstack/match-sorter-utils'

import classnames from 'classnames'

import { toast } from 'react-toastify'

import styles from './RedditConnects.module.css'
import tableStyles from '@core/styles/table.module.css'
import CustomAvatar from '@/@core/components/mui/Avatar'
import OptionMenu from '@/@core/components/option-menu'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import Chip from '@/@core/components/mui/Chip'
import { SocialSearchService } from '@/tallulah-ts-client/services/SocialSearchService'
import type { PostTagResponse } from '@/tallulah-ts-client/models/PostTagResponse'
import { PostState } from '@/tallulah-ts-client/models/PostState'

export interface IRedditSearch {
  sampleTextProp?: string
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type TagsWithActionsType = PostTagResponse & {
  actions?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper<TagsWithActionsType>()

const ConnectsTable = ({ connectsData, refresh }: { connectsData?: PostTagResponse[]; refresh: any }) => {
  // States
  const [status, setStatus] = useState<PostTagResponse['status'] | 'All'>('All')
  const [rowSelection, setRowSelection] = useState({})
  const [allData, setAllData] = useState(...[connectsData])
  const [data, setData] = useState(allData)
  const [globalFilter, setGlobalFilter] = useState('')

  function openInNewTab(url: string) {
    window?.open(url, '_blank')?.focus()
  }

  const updateStatus = (id: string, status: PostState) => {
    SocialSearchService.redditUpdateTagStatus(id, status)
      .then(response => {
        console.log(response)
        toast.success('Post status updated to ' + status)
        refresh()
      })
      .catch(error => {
        console.log(error)
        toast.error('Failed updating the post status.')
      })
  }

  const columns = useMemo<ColumnDef<TagsWithActionsType, any>[]>(
    () => [
      columnHelper.accessor('social', {
        header: 'Platform',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <div>
              <i className={'tabler-brand-' + row.original.social} />
            </div>
            {/* <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.social}
              </Typography>
            </div> */}
          </div>
        )
      }),
      columnHelper.accessor('post.title', {
        header: 'Post Title',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {row.original.post.images && row.original.post.images.length > 0 && (
              <CustomAvatar src={row.original.post.images[0]} size={34} />
            )}
            <div className='flex flex-col items-start'>
              <Typography
                component={Link}
                href={row.original.post.link}
                color='primary'
                className='font-medium'
                onClick={e => {
                  e.preventDefault()
                  openInNewTab(row.original.post.link)
                }}
              >
                {row.original.post.title}
              </Typography>
              <Typography variant='body2'>
                @{' '}
                {new Date(row.original.post.post_time).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('user_name', {
        header: 'User',

        // sortingFn: (rowA, rowB) => rowA.original.review - rowB.original.review,
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {/* <CustomAvatar src={row.original.avatar} size={34} /> */}
            <div className='flex flex-col items-start'>
              <Typography color='primary' className='font-medium'>
                {row.original.user_name}
              </Typography>
              <Typography variant='body2'>{row.original.job_title}</Typography>
            </div>
          </div>
        )
      }),

      // columnHelper.accessor('post.post_time', {
      //   header: 'Post Time',
      //   sortingFn: (rowA, rowB) => {
      //     const dateA = new Date(rowA.original.post.post_time)
      //     const dateB = new Date(rowB.original.post.post_time)

      //     return dateA.getTime() - dateB.getTime()
      //   },
      //   cell: ({ row }) => {
      //     const date = new Date(row.original.post.post_time).toLocaleDateString('en-US', {
      //       month: 'short',
      //       day: '2-digit',
      //       year: 'numeric',
      //       hour: '2-digit',
      //       minute: '2-digit'
      //     })

      //     return <Typography>{date}</Typography>
      //   }
      // }),
      columnHelper.accessor('added_time', {
        header: 'Tagged At',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.added_time)
          const dateB = new Date(rowB.original.added_time)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.added_time + 'Z').toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })

          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label={row.original.status}
              variant='tonal'
              color={
                row.original.status === 'APPROVED' ? 'success' : row.original.status === 'DENIED' ? 'error' : 'warning'
              }
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Update',
        cell: ({ row }) => (
          <OptionMenu
            iconButtonProps={{ size: 'medium' }}
            iconClassName='text-textSecondary'
            options={[
              {
                text: 'Requested',
                icon: 'tabler-message-question',
                linkProps: { className: 'flex items-center gap-2 is-full plb-2 pli-4' },
                menuItemProps: {
                  className: 'flex items-center',
                  onClick: () => updateStatus(row.original.id, PostState.REQUESTED)
                }
              },
              {
                text: 'In Progress',
                icon: 'tabler-eye',
                linkProps: { className: 'flex items-center gap-2 is-full plb-2 pli-4' },
                menuItemProps: {
                  className: 'flex items-center',
                  onClick: () => updateStatus(row.original.id, PostState.IN_PROGRESS)
                }
              },
              {
                text: 'Approved',
                icon: 'tabler-check',
                linkProps: { className: 'flex items-center gap-2 is-full plb-2 pli-4' },
                menuItemProps: {
                  className: 'flex items-center',
                  onClick: () => updateStatus(row.original.id, PostState.APPROVED)
                }
              },
              {
                text: 'Denied',
                icon: 'tabler-x',
                menuItemProps: {
                  className: 'flex items-center',
                  onClick: () => updateStatus(row.original.id, PostState.DENIED)
                }
              }
            ]}
          />
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: data as PostTagResponse[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    enableRowSelection: false, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    const filteredData = allData?.filter(review => {
      if (status !== 'All' && review.status !== status) return false

      return true
    })

    setData(filteredData)
  }, [status, allData, setData])

  useEffect(() => {
    setAllData(connectsData)
    setData(connectsData)
  }, [connectsData])

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

const RedditConnects = () => {
  const [data, setData] = useState<any>([])

  const refresh = () => {
    SocialSearchService.redditTags(null, 'added_time', -1, 0, 1000)
      .then(response => {
        console.log(response)
        setData(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Patient Connects</h2>
      <ConnectsTable connectsData={data} refresh={refresh} />
    </div>
  )
}

export default RedditConnects
