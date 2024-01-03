<template>
  <nav aria-label="Page navigation" class="nav-pagination">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <a class="page-link"
        href="#"
        aria-label="Previous"
        @click.prevent="changePage(currentPage - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item"
      v-for="page in totalPages" :key="page"
      :class="{ active: page === currentPage }">
        <a class="page-link" href="#" @click.prevent="selectPage(page)">{{ page }}</a>
      </li>
      <li class="page-item"
      :class="{ disabled: currentPage >= totalPages }">
        <a class="page-link"
        href="#"
        aria-label="Next"
        @click.prevent="changePage(currentPage + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['change-page']);

const selectPage = (page) => {
  if (page !== props.currentPage) {
    emit('change-page', page);
  }
};

const changePage = (page) => {
  const newPage = Math.max(1, Math.min(page, props.totalPages));
  selectPage(newPage);
};
</script>

<style scoped lang="scss">
.nav-pagination {
    display: flex;
    margin: 2rem auto;
    flex-direction: column;
    align-items: center;

    .pagination {
        display: flex;
        list-style: none;
        padding-left: 0;

        @media only screen and (max-width: 768px) {
            flex-wrap: wrap;
            justify-content: center;
        }

        .page-item {
            margin: 0 2px;

            .page-link {
                display: block;
                padding: 0.5rem 0.75rem;
                color: #007bff;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #dee2e6;
                border-radius: 0.25rem;

                &:hover {
                    color: #0056b3;
                    background-color: #e9ecef;
                    border-color: #dee2e6;
                }
            }

            &.disabled {
                .page-link {
                    color: #6c757d;
                    pointer-events: none;
                    background-color: #fff;
                    border-color: #dee2e6;
                }
            }

            &.active {
                .page-link {
                    color: #fff;
                    background-color: #007bff;
                    border-color: #007bff;
                }
            }
        }
    }
}
</style>
