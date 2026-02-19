
<template>
  <u-page>
    <!-- Header Search & Action -->
    <u-view class="w-full" padding="pt-1 px-2">
      <u-row flex1>
        <div class="font-bold text-lg text-primary">Kartu Stok</div>
      </u-row>
    </u-view>

    <u-separator />

    <u-view>

      <u-row flex1 class="w-full justify-between">
        <u-row>
          <u-input-search v-model="store.params.q" @update:modelValue="store.setSearch" :debounce="500" />
          <PerPage :fields="store.perPages" v-model="store.params.per_page" @update:modelValue="store.setPerPage" />
        </u-row>

        <u-row>
          <u-btn-icon icon="print" tooltip="Print" v-print="printObj" />
        </u-row>

        <u-row>
          <u-select label="Pilih Bulan" v-model="store.params.bulan" :options="bulans"
            @update:modelValue="store.setRange" />
        </u-row>
        <u-row>
          <u-select label="Pilih Tahun" v-model="store.params.tahun" :options="generateTahuns"
            @update:modelValue="store.setRange" />
        </u-row>
      </u-row>
    </u-view>

    <u-view class="w-full relative print-a4" flex1 scrollY gap="gap-0" padding="p-0">
        <u-view v-if="store.loading" flex1 class="flex items-center justify-center w-full">
          <u-load-spinner />
        </u-view>

        <!-- Tabel -->
      <div v-else class=" bg-white rounded-lg">
        <table class="w-full border-collapse">
          <thead class=" text-gray-700 text-sm uppercase">
            <tr>
              <th class="th text-left sticky-header">NO</th>
              <th class="th text-left sticky-header">NAMA BARANG</th>
              <th class="th text-right sticky-header">SALDO AWAL</th>
              <th class="th text-right sticky-header">STOK MASUK</th>
              <th class="th text-right sticky-header">STOK KELUAR</th>
              <th class="th text-right sticky-header">PENYESUAIAN</th>
              <th class="th text-right sticky-header">STOK AKHIR</th>
              <th class="th text-right sticky-header">AKSI</th>
              
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in store.items" :key="i">
              
              <tr class="border-b last:border-0">
                <td class="td text-gray-600">
                   {{ i+1 }}

                </td>
                <td class="">{{ item?.nama }}</td>
                <td class="text-right">{{ saldoAwal(item) }} {{ item?.satuan_k }}</td>
                <td class="text-right">{{ totalMasuk(item) }} {{ item?.satuan_k }}</td>
                <td class="text-right">{{ totalKeluar(item) }} {{ item?.satuan_k }}</td>
                <td class="text-right">{{ totalPenyesuaian(item) }} {{ item?.satuan_k }}</td>
                <td class="text-right">{{ totalStokAkhir(item) }} {{ item?.satuan_k }}</td>
                <td class="text-right">
                  <u-row class="col-span-12 justify-self-end pt-2 pb-2">
                   <u-btn :loading="loadingOpen[item.id] === true" label="Detail" @click="openDetail(item)" />
                  </u-row>
                </td>
              </tr>
            </template>
          </tbody>
          
        </table>
      
      </div>
      
    </u-view>
    
    <u-view>
      <Pagination v-if="store?.meta" v-model:currentPage="store.params.page" :total-items="store?.meta?.total"
        :per-page="store.params.per_page" @update:current-page="(val) => {
          // console.log('page', val);
          store.params.page = val
          store.fetchData()
        }" />
    </u-view>
    <cetak-data v-if="printObj" id="printAreax" ref="printAreax" :items="store.items" :store="store" />
    <modal-detail v-if="openModalDetail" v-model="openModalDetail" title="Detail Kartu Stok" :store="store"
      @close="handleCloseModalNota" />
  </u-page>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue"
import { formatRpkoma, formatRupiah } from "@/utils/numberHelper"
import { formatDateIndo } from "@/utils/dateHelper"
import { useAppStore } from "@/stores/app"
import Pagination from "./Pagination.vue"
import PerPage from "./PerPage.vue"
import { useKartuStoksStore } from "@/stores/laporan/kartustok"
import { api } from "@/services/api"
const CetakData = defineAsyncComponent(() => import('../CetakData.vue'))
const store = useKartuStoksStore() 
const ModalDetail = defineAsyncComponent(() => import('./ListRincian.vue'))

const openModalDetail = ref(false)
const loadingOpen = ref({})
const openDetail = async (row) => {
  loadingOpen.value[row.id] = true 
  try {
    const params = {
      bulan: store.params.bulan,
      tahun: store.params.tahun,
      id: row.id
    }
    // console.log('params', params)
    const response = await api.get(`api/v1/transactions/stok/get-rinci-kartu-stok`, { params })
    if (response) {

      store.item = response.data.data
    }
  } catch (error) {
    console.error('Error fetching Kartu Stok:', error)
  } finally {
    loadingOpen.value[row.id] = false
  }
  openModalDetail.value = true
}

const handleCloseModalNota = () => {
  openModalDetail.value = false
  loadingOpen.value = {}
}

const now = new Date()
const bulanSekarang = String(now.getMonth() + 1).padStart(2, '0')
const tahunSekarang = now.getFullYear()
const bulans = computed(() => [
  { label: 'Januari', value: '01' },
  { label: 'Februari', value: '02' },
  { label: 'Maret', value: '03' },
  { label: 'April', value: '04' },
  { label: 'Mei', value: '05' },
  { label: 'Juni', value: '06' },
  { label: 'Juli', value: '07' },
  { label: 'Agustus', value: '08' },
  { label: 'September', value: '09' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
])
const generateTahuns = computed(() => {
  const tahuns = []
  for (let i = tahunSekarang - 2; i <= tahunSekarang + 2; i++) {
    tahuns.push({ label: i.toString(), value: i })
  }
  return tahuns
})

onMounted(async () => {
  store.params.per_page = 100
  getCurrentDate()
  await store.fetchData()
  // await handleRange()
  // if(handleRange()){
  //   if (!store.range.start_date) {
  //     store.range.start_date = bulanSekarang
  //   }
  //   if (!store.range.end_date) {
  //     store.range.end_date = tahunSekarang.toString()
  //   }
  // }
})

const getCurrentDate = () => {
  const now = new Date()
  // const start = new Date(now.getFullYear(), now.getMonth(), 1)
  // const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  // store.range = {
  //   start_date: toLocalDateString(bulan),
  //   end_date: toLocalDateString(tahun),
  // }
  const bulan = String(now.getMonth() + 1).padStart(2, '0')
  const tahun = now.getFullYear()
  // console.log('start', start)
  // console.log('end', end)
  // store.range = {
  //   start_date: bulan,
  //   end_date: tahun,
  // }
  store.params.bulan = bulan
  store.params.tahun = tahun
}


const printAreax = ref(null)

const printObj = {
  id: '#printAreax', // ref elemen yang mau diprint
  popTitle: 'Kartu Stok',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback(vue) {
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    console.log('closePrint')
  }
}



function saldoAwal(item) {
  return (item?.stok_awal ?? [])
    .reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
}


function totalMasuk(item) {
  const masuk =
    (item?.penerimaan_rinci ?? [])
      .reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)

  const returBeli =
    (item?.retur_pembelian_rinci ?? [])
      .reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)

  return masuk - returBeli
}

function totalKeluar(item) {
  const keluar =
    (item?.penjualan_rinci ?? [])
      .reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)

  const returJual =
    (item?.retur_penjualan_rinci ?? [])
      .reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)

  return keluar - returJual
}

function totalPenyesuaian(item) {
  return (item?.penyesuaian ?? [])
    .reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
}
function totalStokAkhir(item) {
  return (
    saldoAwal(item) +
    totalMasuk(item) -
    totalKeluar(item) +
    totalPenyesuaian(item)
  )
}
// stok akhir
const stokSekarang = computed(() => {
  return (store.items?.stok ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
})
</script>

<style scoped>
@media screen {
  #printAreax {
    display: none;
  }
}

@media print {
  body * {
    visibility: hidden;
  }

  #printAreax,
  #printAreax * {
    visibility: visible;
  }

  #printAreax {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}

</style>
