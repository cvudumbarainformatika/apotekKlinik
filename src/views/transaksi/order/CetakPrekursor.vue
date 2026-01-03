<!-- PrintPrekursor.vue -->
<template>
    <div id="print-prekursor" class="print-a4 bg-white text-black p-4">
        <div class=" max-w-full bg-white text-black mx-auto p-4 print-a4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-6">
                <div class="flex items-center gap-4">
                    <img src="/images/logo.png" alt="logo" class="w-14 h-14 object-contain" />
                    <div>
                        <div class="text-xl font-semibold tracking-wide">{{ company?.nama || 'Belum di setting' }}</div>
                        <p class="text-sm text-gray-600">
                            Nomor SIA : {{ company?.nomor_sia }}<br />
                        </p>
                        <p class="text-sm text-gray-600">
                            {{ company?.alamat || 'Alamat Apotik nya' }}<br />
                            Telp: {{ formatTeleponID(company?.telepon) || '0' }}
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <!-- <div class="inline-block px-3 py-1 rounded-full border text-xs uppercase tracking-wider">
                ORDER PRODUCT
              </div> -->
                    <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        <div class="text-gray-500">No. Order</div>
                        <div class="font-medium">{{ data?.nomor_order || '-' }}</div>
                        <div class="text-gray-500">Tanggal</div>
                        <div class="font-medium">{{ formatDateIndo(data?.tgl_order) }}</div>
                        <!-- <div class="text-gray-500">Supplier</div>
                <div class="font-medium">{{ data?.supplier?.nama || '-' }}</div> -->
                    </div>
                </div>
            </div>


            <div class="w-full border-t border-dashed border-black my-1"></div>
            <div class="w-full text-center">SURAT PESANAN OBAT MENGANDUNG PREKUSOR FARMASI</div>
            <div class="flex items-start gap-6">
                <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                    <div class="w-ful"> Yang bertanda tangan di bawah ini :</div>
                    <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                        <div class="">Nama</div>
                        <div class="">: {{ data?.apoteker?.nama || '-' }}</div>
                        <div class="">Jabatan</div>
                        <div class="">: Apoteker Penanggung Jawab</div>
                        <div class="">Nomor SIPA</div>
                        <div class="">: {{ data?.apoteker?.sipa || '-' }}</div>
                        <!-- <div class="text-gray-500">Supplier</div>
                <div class="font-medium">{{ data?.supplier?.nama || '-' }}</div> -->
                    </div>
                    <div class="w-ful">Mengajukan pesanan obat mengandung prekursor farmasi kepada :</div>
                    <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                        <div class="">Nama Distributor</div>
                        <div class="">: {{ data?.supplier?.nama || '-' }}</div>
                        <div class="">Alamat</div>
                        <div class="">: Apoteker Penanggung Jawab</div>
                        <div class="">Nomor SIPA</div>
                        <div class="">: {{ data?.supplier?.alamat || '-' }}</div>
                    </div>
                    <div class="w-ful">Jenis obat mengandung prekursor farmasi yang dipesan adalah :</div>
                </div>
                <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                </div>
            </div>

            <!-- Items Table -->
            <div class="mt-2">
                <table class="w-full text-sm border-separate [border-spacing:0]">
                    <thead>
                        <tr class="text-left">
                            <th class="th">No</th>
                            <th class="th">Nama Obat</th>
                            <th class="th">Zat Aktif Prekursor Farmasi</th>
                            <th class="th">Bentuk/Kekuatan Sediaan</th>
                            <th class="th">Satun</th>
                            <th class="th text-right">Jumlah</th>
                            <th class="th">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(it, idx) in data?.order_records" :key="idx" class="align-top">
                            <td class="td text-gray-500">{{ idx + 1 }}</td>
                            <td class="td">
                                <div class="font-medium">{{ it?.master?.nama || '-' }}</div>
                            </td>
                            <td class="td">{{ it?.master?.kandungan || '-' }}</td>
                            <td class="td">{{ it?.master?.kesediaan || '-' }}</td>
                            <td class="td">{{ it?.satuan_b }}</td>
                            <td class="td text-right">{{ it?.jumlah_pesan || 0 }} {{ it?.satuan_b }}</td>
                            <td class="td">{{ it?.keterangan || '-' }}</td>
                        </tr>
                        <tr v-if="data?.rincian?.length === 0">
                            <td class="td text-center text-gray-500" colspan="8">Belum ada item retur.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="w-ful mt-3 text-sm"> Obat mengandung prekursor farmasi tersebut akan digunakan untuk memenuhi
                kebutuhan
                :</div>
            <!-- Totals & Notes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="kiri">
                    <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                        <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                            <div class="">Nama Apotek</div>
                            <div class="">: {{ company?.nama || 'Belum di setting' }}</div>
                            <div class="">Alamat Apotek</div>
                            <div class="">: {{ company?.alamat || 'Belum di setting' }}</div>
                            <div class="">Nomor SIA</div>
                            <div class="">: {{ company?.nomor_sia || 'Belum di setting' }}</div>
                        </div>
                    </div>
                </div>
                <div class="kanan">
                    <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                        <div class="mt-9 text-center">Probolinggo, {{ today }} </div>
                        <div class="mt-9 text-center">{{ data?.apoteker?.nama || '-' }}</div>
                    </div>
                </div>
            </div>

            <div class="mt-2 pt-6 text-center text-[10px] leading-snug">
                <div class="w-full border-t border-dashed border-black my-1"></div>
                <p class="mt-2">&copy; 2025 CV Udumbara Informatika</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatDateIndo } from '@/utils/dateHelper';
import { formatTeleponID } from '@/utils/numberHelper';
import { computed } from 'vue';

defineProps({
    store: { type: Object, required: true }
})
const app = useAppStore()
const today = computed(() => {
    return formatDateIndofull(new Date())
})
const company = computed(() => {
    return app?.form || null
})

// const data = computed(() => {
//     console.log('data', props.store.form)
//     return props.store.form
// })
// const totalSubtotal = computed(() => {
//     const items = data?.value?.rincian || []
//     return items.reduce((a, b) => a + Number(b?.subtotal), 0)
// })
// const totalPajak = computed(() => {
//     const items = data?.value?.rincian || []
//     return items.reduce((a, b) => a + Number(b?.pajak_rupiah), 0)
// })

// const totals = computed(() => {
//     return (totalSubtotal.value + totalPajak.value) || 0
// })
</script>