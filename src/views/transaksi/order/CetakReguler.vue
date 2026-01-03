<!-- PrintReguler.vue -->
<template>
    <div id="print-reguler" class="print-a4 bg-white text-black p-4">
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
                            {{ company?.alamat || 'Belum di setting' }}<br />
                            Telp: {{ formatTeleponID(company?.telepon) || '0' }}
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="inline-block px-3 py-1 rounded-full border text-xs uppercase tracking-wider">
                        ORDER PRODUCT
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        <div class="text-gray-500">No. Order</div>
                        <div class="font-medium">{{ data?.nomor_order || '-' }}</div>
                        <div class="text-gray-500">Tanggal</div>
                        <div class="font-medium">{{ formatDateIndo(data?.tgl_order) }}</div>
                        <div class="text-gray-500">Supplier</div>
                        <div class="font-medium">{{ data?.supplier?.nama || '-' }}</div>
                    </div>
                </div>
            </div>


            <div class="w-full border-t border-dashed border-black my-1"></div>
            <div class="flex items-start justify-between gap-6">
                <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                    <div class="text-gray-500">Apoteker :
                        <span class="font-medium">{{ data?.apoteker?.nama || '-' }} ({{ data?.apoteker?.sipa || '-'
                            }})</span>
                    </div>

                </div>
                <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                </div>
            </div>


            <!-- Items Table -->
            <div class="mt-3">
                <table class="w-full text-sm border-separate [border-spacing:0]">
                    <thead>
                        <tr class="text-left">
                            <th class="th">#</th>
                            <th class="th">Kode</th>
                            <th class="th">Nama Barang</th>
                            <th class="th text-right">Jumlah Pesan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(it, idx) in data?.order_records" :key="idx" class="align-top">
                            <td class="td text-gray-500">{{ idx + 1 }}</td>
                            <td class="td">{{ it?.kode_barang || '-' }}</td>
                            <td class="td">
                                <div class="font-medium">{{ it?.master?.nama || '-' }}</div>
                            </td>
                            <td class="td text-right">{{ it?.jumlah_pesan || 0 }} {{ it?.satuan_b }}</td>
                        </tr>
                        <tr v-if="data?.rincian?.length === 0">
                            <td class="td text-center text-gray-500" colspan="8">Belum ada item retur.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Totals & Notes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="rounded-xl p-4 bg-gray-50">
                </div>
                <div class="rounded-xl p-4 bg-gray-50">
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center justify-between">
                            <span>Total Item Order</span>
                            <span class="font-medium">{{ data.order_records?.length || 0 }}</span>
                        </div>
                        <div class="border-t my-2"></div>
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
import { useAppStore } from '@/stores/app'
import { formatDateIndo } from '@/utils/dateHelper'
import { formatTeleponID } from '@/utils/numberHelper'
import { computed } from 'vue'

defineProps({
    store: { type: Object, required: true }
})
const app = useAppStore()
// const today = computed(() => {
//     return formatDateIndofull(new Date())
// })
// const company = computed(() => {
//     return app?.form || null
// })

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
