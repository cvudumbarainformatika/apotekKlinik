
<template>
  <u-page>
    <!-- Header Search & Action -->
    <u-view class="w-full" padding="pt-1 px-2">
      <u-row flex1>
        <div class="font-bold text-lg text-primary">List Data Stok</div>
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
          <u-btn-icon icon="print" tooltip="TPrint" v-print="printObj" />
        </u-row>
      </u-row>
      <!-- <u-row right justify-self-end class="gap-2">
        <u-date-range  v-model="store.range" @update:modelValue="store.setRange"
          default-period="today" />
      
      </u-row> -->
    </u-view>

   

    <u-view class="w-full relative print-a4" flex1 scrollY gap="gap-0" padding="p-0">
        <u-view v-if="store.loading" flex1 class="flex items-center justify-center w-full">
          <u-load-spinner />
        </u-view>

        <!-- Tabel -->
      <div v-else class=" bg-white rounded-lg">

        <!-- Header -->
      <!-- <div class="flex items-start justify-between gap-6 mb-1">
        <div class="flex items-center gap-4">
          <img src="/images/logo.png" alt="logo" class="w-14 h-14 object-contain" />
          <div>
            <div class="text-xl font-semibold tracking-wide">{{ app?.form?.nama || 'Nama Apotik nya' }}</div>
             <p class="text-sm text-gray-600">
                Nomor SIA : {{ app?.form?.nomor_sia }}<br />
              </p>
            <p class="text-sm text-gray-600">
              {{ app?.form?.alamat || 'Alamat Apotik nya' }}<br />
              Telp: {{ app?.form?.telepon || '08123456789' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col p-2">
          <div class="pt-2 uppercase text-md font-bold text-right">
            List Data Stok
          </div>
        </div>
      </div> -->
       <u-grid cols="12" class="relative right-0">
          <u-row class="col-span-5 justify-self-end">
            <div v-if="openmodalData && selectedItem" class="absolute z-30 top-2 right-4 w-[1000px]
         bg-background border border-primary rounded-xl
         shadow-lg p-4">
              <u-grid cols="12" gap="gap-4">

                <div class="col-span-12 font-bold text-lg">
                  Penyesuaian Stok
                  <span class="text-primary">
                    ({{ modalMode === 'tambah' ? 'tambah' : 'kurangi' }})
                  </span>
                </div>

                <div class="col-span-6">
                  <u-text class="font-bold">Nama Barang</u-text>
                  <u-text>{{ selectedItem.barang?.nama }}</u-text>
                </div>

                <div class="col-span-6 text-right">
                  <u-text class="font-bold">Stok Saat Ini</u-text>
                  <u-text>
                    {{ selectedItem.jumlah_k }} {{ selectedItem.satuan_k }}
                  </u-text>
                </div>

                <div class="col-span-12">
                  <u-separator />
                </div>

                <u-row class="col-span-3">
                  <u-input ref="inpJumlahRef" v-model="form.jumlah" label="Jumlah" type="number"
                    :error="isError('jumlah')" :error-message="errorMessage('jumlah')" />
                </u-row>

                <u-row class="col-span-3">
                  <u-input v-model="form.satuan_k" label="Satuan" readonly />
                </u-row>

                <u-row class="col-span-6">
                  <u-input v-model="form.keterangan" label="Keterangan" type="text" />
                </u-row>

                <u-row right class="col-span-12 gap-2">
                  <u-btn variant="secondary" label="Batal" @click="handleBatal" />
                  <u-btn :loading="store.loadingSave" label="Simpan" @click="handleSubmit" />
                </u-row>

              </u-grid>
            </div>
          </u-row>
        </u-grid>
        <table class="w-full border-collapse">
          <thead class=" text-gray-700 text-sm uppercase">
            <tr>
              <th class="th text-left sticky-header">NO</th>
              <th class="th text-left sticky-header">NAMA BARANG</th>
              <th class="th text-right sticky-header">SATUAN</th>
              <th class="th text-right sticky-header">HARGA RESEP</th>
              <th class="th text-right sticky-header">HARGA UMUM</th>
              <th class="th text-right sticky-header">STOK</th>
              <th class="th text-right sticky-header">PENYESUAIAN</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in store.items" :key="i">
              
              <tr class="border-b last:border-0">
                <td class="td text-gray-600">
                   {{ i+1 }}

                </td>
                <td class="">{{ item?.barang?.nama }}</td>
                <td class="text-right">1 {{ item?.satuan_b }} isi {{ item?.isi }} {{ item?.satuan_k }}</td>
                <td class="text-right">{{ formatRpkoma(item?.barang?.harga_jual_resep_k) }}</td>
                <td class="text-right">{{ formatRupiah(item?.barang?.harga_jual_biasa_k) }}</td>
                <td class="text-right">{{ formatRupiah(item?.jumlah_k) }} {{ item?.satuan_k }}</td>
                <td class="text-right">
                  <u-row class="col-span-12 justify-self-end pt-2 pb-2">
                    <u-btn-icon variant="secondary" @click="openModalMinus(item)" icon="minus" tooltip="Kurangi Stock" />
                    <u-btn-icon @click="openModalTambah(item)" icon="plus" tooltip="Tambah Stock" />
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
   <cetak-data v-if="printObj" id="printAreax" ref="printAreax" :items="store.items" />
    
  </u-page>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue"
import { formatRpkoma, formatRupiah } from "@/utils/numberHelper"
import { formatDateIndo } from "@/utils/dateHelper"
import { useAppStore } from "@/stores/app"


import Pagination from "./Pagination.vue"
import PerPage from "./PerPage.vue"
import { useStockListStore } from "@/stores/laporan/stocklist"
const CetakData = defineAsyncComponent(() => import('../CetakData.vue'))
const store = useStockListStore()
const app = useAppStore()
const menuBarangRef = ref(null)
const inpJumlahRef = ref(null)
const openmodalData = ref(false)
const selectedItem = ref(null)
const modalMode = ref(null) // 'tambah' | 'minus'
const isModalTambah = ref(false)
const isModalMinus = ref(false)
onMounted(store.fetchData)

// function getTotal (item) {
//   let subtotal = 0
//   let subtotalRetur
//   item.rinci.forEach((r) => {
//     subtotal += parseInt(r?.subtotal)
//   })


//   return subtotal
// }
const form = ref({
  id_stok: null,
  kode_barang: '',
  jumlah: 0,
  satuan_k: '',
  keterangan: ''

})
const error = computed((item) => {
  const err = item?.error
  const status = err?.status === 422
  if (status) {
    return err?.response?.data?.errors
  }
  return null
})
function isError(field) {
  return !!error.value?.[field]
}

function errorMessage(field) {
  return error.value?.[field]?.[0] ?? null
}
const clearSelectedBarang = () => {
  form.value.jumlah = 0
  form.value.keterangan = ''
}
const openModalTambah = (item) => {
  console.log('itemscacac', item)
  selectedItem.value = item
  modalMode.value = 'tambah'
  openmodalData.value = true
  // isModalTambah.value = true
  // isModalMinus.value = false
  form.value = {
    id_stok: item.id,
    kode_barang: item.kode_barang,
    jumlah: 0,
    satuan_k: item.satuan_k,
    keterangan: ''
  }
  clearSelectedBarang()
}

const openModalMinus = (item) => {
  console.log('items Minus', item)

  selectedItem.value = item
  modalMode.value = 'kurangi'
  openmodalData.value = true
  // isModalMinus.value = true
  // isModalTambah.value = false
  form.value = {
    id_stok: item.id,
    kode_barang: item.kode_barang,
    jumlah: 0,
    satuan_k: item.satuan_k,
    keterangan: ''
  }
  clearSelectedBarang()
}


const handleSubmit = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (modalMode.value === 'tambah') {
    form.value.jumlah = Math.abs(form.value.jumlah)
    // console.log('form tambah', form.value)
  } else if (modalMode.value === 'kurangi') {
    form.value.jumlah = -Math.abs(form.value.jumlah)
    // console.log('form minus', form.value)
  }
  // console.log('form', form.value);
  try {
    await store.create(form.value)
      // .then(() => {
    
    await store?.fetchData()

    console.log('Data saved successfully:', store.items)
      // })
    
  } catch (err) {
    store.error = err
  } finally {
    clearSelectedBarang()
  }


  // store.fetchAll()
}
const handleBatal = () => {
  clearSelectedBarang()
  openmodalData.value = false
  selectedItem.value = null
  modalMode.value = null
}

const printAreax = ref(null)

const printObj = {
  id: '#printAreax', // ref elemen yang mau diprint
  popTitle: 'List Data Stok',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback (vue) {
    console.log('wait...')
  },
  openCallback (vue) {
    console.log('opened')
  },
  closeCallback (vue) {
    console.log('closePrint')
  }
}
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
