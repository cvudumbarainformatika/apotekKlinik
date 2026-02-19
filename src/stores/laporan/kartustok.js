import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'
import { getToday } from '@/utils/dateHelper'
import { set } from '@vueuse/core';
import { useNotificationStore } from '../notification';
const notify = useNotificationStore().notify
export const useKartuStoksStore = defineStore('kartu-stok-store', {
  state: () => ({
    items: [],
    item: null,
    params: {
      q: '',
      per_page: 50,
      page: 1,
      order_by: 'nama',
      sort: 'asc',
      bulan: String(new Date().getMonth() + 1).padStart(2, '0'),
      tahun: new Date().getFullYear(),
    },
    grand: null,
    meta: null,
    loading: false,
    loadingSave: false,
    loadingMore: false,

    range:{
      start_date: null,
      end_date:  null
    },

    perPages: [50, 100, 200, 500, 1000 ],
    
  }),

  // persist: true,

  actions: {
    setRange(val) {
      console.log('range', val);
      
      this.params.from = val.start_date
      this.params.to = val.end_date
      this.params.page = 1
      this.fetchData()
    },  
    setPage(page) {
      this.params.page = page
      this.fetchData()
    },

    setPerPage(perPage) {
      this.params.per_page = perPage
      this.params.page = 1
      this.fetchData()
    },
    setSearch(term) {
      this.params.q = term
      this.params.page = 1
      this.fetchData()
    },
    async fetchData(extraParams = {}) {
      this.loading = true
      try {
        const params = {
          ...this.params,
          ...extraParams
        }
        const res = await api.get('/api/v1/transactions/stok/get-kartu-stok', { params })
        console.log(`resp getList Kartu stok : `, res);
        this.items = res.data.data ?? res.data ?? []
        this.meta = res.data.meta ?? res.meta ?? null
        // this.grand = res.data.grand_total ?? null
        // this.hasMore = this.page < (this.meta?.last_page ?? 1)
      } catch (err) {
        console.log(`error getList : `, err);
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async create(data) {
        // console.log('data', data);
        // console.log('mode', mode);
        this.loadingSave = true
        
        
        try {
            const res = await api.post('/api/v1/transactions/stok/simpan', data)
            console.log(`resp create : `, res);
            // if (res.status === 200) {
            const result = res.data?.data?.header ?? res.data?.data ?? null
            // if (this.mode === 'add') {
            //     this.items.unshift(result)
            //     this.initModeEdit(result)
            // } else {
            //     this.initModeEdit(result)
            // }

            this.error = null
            // }

            notify({ message: res.data.message ?? 'Berhasil Menyimpan data', type: 'success' })
            
        } catch (err) {
            console.log(`error create : `, err);
            this.error = err
            notify({ message: err.response?.data?.message ?? 'Gagal menyimpan data', type: 'error' })
        } finally {
            this.loadingSave = false
        }
        },

  },



  getters: {
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useKartuStoksStore, import.meta.hot))

}
