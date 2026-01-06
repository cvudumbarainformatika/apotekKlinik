<template>
    <u-modal persistent :title="`Tambah ${title}`" @close="emit('close')">
        <template #default>
            <u-row flex1 class="w-full justify-between">
                <u-row padding="p-3" class="w-full">
                    <slot name="search">
                        <u-input-search v-model="props.store.q" 
                            :debounce="300" />
                    </slot>
                </u-row>
            </u-row>
            <template v-if="store.loading">
                <u-view flex1 class="flex items-center justify-center w-full">
                    <u-load-spinner />
                </u-view>
            </template>
            <template v-else>
                <u-list :items="props.store.dataorder" anim>
                    <template #item="{ item }">
                        <u-view padding="px-3 py-3" flex1 class="w-full cursor-pointer" @click="handlePilih(item)">
                            <u-row flex1 class="w-full">
                                <u-row flex1>
                                    <u-col gap="gap-0" class="w-full">
                                        <u-row flex1>
                                            <u-text class="font-bold" color="text-gray-500">{{ item?.supplier?.nama
                                                }}</u-text>
                                            <u-text class="" color="text-primary">{{ item?.nomor_order }}</u-text>
                                        </u-row>
                                        <u-row>
                                            <u-icon size="14" name="shopping-cart"></u-icon>
                                            <u-text class="" color="text-gray-500">{{ item?.order_records?.length }}
                                                items</u-text>
                                        </u-row>
                                    </u-col>
                                </u-row>

                                <u-col align="items-end" gap="gap-0" class="" padding="p-0">
                                    <u-text color="text-gray-500" style="font-size: 10px !important;">{{
                                        formatDateIndo(item?.tgl_order) }}</u-text>
                                    <!-- <u-icon name="lock-open" size="18" class="mb-1"
                                    :class="!item?.flag ? 'text-success' : 'text-danger'" /> -->
                                    <u-text color="text-gray-500" style="font-size: 10px !important;">{{
                                        useWaktuLaluReactive(item?.created_at) }}</u-text>
                                </u-col>
                            </u-row>
                        </u-view>
                    </template>
                </u-list>
            </template>
        </template>
    </u-modal>
</template>
<script setup>
import { api } from '@/services/api'
import { formatDateIndo, useWaktuLaluReactive } from '@/utils/dateHelper'
// import { useOrderStore } from '@/stores/template/register'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
    store: { type: Object, required: true },
    items: { type: Array, default: () => [] },
    title: { type: String, default: 'Data' },
})

// const store = useOrderStore()

onMounted(() => {
    // console.log('Mounted ', store);

    // store.per_page = 20
    // Promise.all([
    //     store.fetchAll()
    // ])
})
const dataorder = ref([])
const pilihOrder = async () => {
    props.store.loading = true
    try {
        const resp = await api.get(
            '/api/v1/transactions/penerimaan/get-list-order',
            {
                params: {
                    q: props.store.q,
                    per_page: 20,
                    // from: getYearStartDate(),
                    // to: getYearEndDate(),
                    flag: '1'
                },
            }
        )

        dataorder.value = resp.data?.data || []
    } catch (e) {
        console.error(e)
        dataorder.value = []
    } finally {
        props.store.loading = false
    }
}
watch(
    () => props.store.q,
    (val) => {
        // optional: minimal 2 huruf
        if (!val || val.length < 2) {
            dataorder.value = []
            return
        }
        pilihOrder()
    }
)
const handlePilih = (item) => {
    // props.store.initModeEdit(item)
    props.store.orderSelected = item
    props.store.orderSelected.order_records = item.order_records
    props.store.supplierSelected = item?.supplier
    console.log('Pilih item: ', props.store.orderSelected.order_records);
    emit('close', item)
    props.store.q = ''
}
</script>