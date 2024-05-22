<template>
  <section>
    <h2 style="text-align: center; margin-top: 20px">Date-wise Transactions</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
      <thead>
        <tr>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Date
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Transaction Count
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Total Payable
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Total Paid
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Total Due
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Dummy Data for Transactions -->
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            2024-01-01
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            30
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $1500.00
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $1400.00
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $100.00
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            2024-01-02
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            25
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $1250.00
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $1200.00
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $50.00
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            2024-01-03
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            40
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $2000.00
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $1950.00
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            $50.00
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import {computed, ref, watch, onMounted} from 'vue'
import moment from 'moment'
import { ReportService } from '@/services/ReportService';
import {formatDate} from '@/utils/index'
definePageMeta({
  layout: "auth-layout",
});

const searchQuery = computed(()=> {
  let startDate = formatDate(moment(), 'YYYY-MM-DD')
  let query = '?paid_by_vehicle_id=2'
  if (true) {
    query += `?start_date=${startDate}`
  }
  return query
})

onMounted(()=> {
  // alert(444)
  ReportService.getTransaction(searchQuery.value)
})
</script>

<style lang="scss" scoped></style>
