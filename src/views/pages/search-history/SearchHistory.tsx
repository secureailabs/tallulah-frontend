import { useEffect, useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Card, TablePagination, Typography } from '@mui/material'

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

import styles from './SearchHistory.module.css'
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import Chip from '@/@core/components/mui/Chip'
import { SocialSearchService } from '@/tallulah-ts-client/services/SocialSearchService'
import type { SearchHistoryResponse } from '@/tallulah-ts-client/models/SearchHistoryResponse'

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

type SearchHistoryActionsType = SearchHistoryResponse & {
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
const columnHelper = createColumnHelper<SearchHistoryActionsType>()

const HistoryTable = ({ historyData }: { historyData?: SearchHistoryResponse[] }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [social, setSocial] = useState<SearchHistoryResponse['social']>('All')
  const [allData, setAllData] = useState(...[historyData])
  const [data, setData] = useState(allData)
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<SearchHistoryActionsType, any>[]>(
    () => [
      columnHelper.accessor('social', {
        header: 'Platform',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div>
              <i className={'tabler-brand-' + row.original.social} />
            </div>
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.social}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('query', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography color='primary' className='font-medium'>
                {row.original.user_name}, {row.original.job_title}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('query', {
        header: 'Search Query',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography color='primary' className='font-medium'>
                {row.original.query}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('search_time', {
        header: 'Date / Time',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.search_time)
          const dateB = new Date(rowB.original.search_time)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.search_time + 'Z').toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })

          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Search Again',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label='Search Again'
              variant='tonal'
              color='warning'
              size='small'
              onClick={() => {
                console.log('Search Again: ' + row.original.query)
                router.push(`/${locale}/social-search/${row.original.social}?q=` + row.original.query)
              }}
              icon={<i className='tabler-history' />}
            />
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: data as SearchHistoryResponse[],
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
    // globalFilterFn: fuzzyFilter,
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
      if (social !== 'All' && review.social !== social) return false

      return true
    })

    setData(filteredData)
  }, [social, allData, setData])

  useEffect(() => {
    setAllData(historyData)
    setData(historyData)
  }, [historyData])

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

const SearchHistory = () => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    SocialSearchService.searchHistory('search_time', -1, 0, 100)
      .then(response => {
        console.log(response)
        setData(response)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Search History</h2>
      <HistoryTable historyData={data} />
    </div>
  )
}

export default SearchHistory
