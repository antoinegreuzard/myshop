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

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    selectPage(page) {
      if (page !== this.currentPage) {
        this.$emit('change-page', page);
      }
    },
    changePage(page) {
      const newPage = Math.max(1, Math.min(page, this.totalPages));
      this.selectPage(newPage);
    },
  },
};
</script>

<style scoped>
.nav-pagination {
    display: flex;
    margin: 2rem auto 0;
    flex-direction: column;
    align-items: center;

  .pagination {
    display: flex;
    list-style: none;
    padding-left: 0;

    .page-item {
      margin: 0 2px;

      .page-link {
        display: block;
        padding: 0.5rem 0.75rem;
        color: #007bff;
        text-decoration: none;
        background-color: #fff;
        border: 1px solid #dee2e6;

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
